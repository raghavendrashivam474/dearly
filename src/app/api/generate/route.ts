import { NextRequest, NextResponse } from "next/server"
import { groq } from "@/lib/groq"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { GenerateRequest } from "@/types/experience"

// ── Quality validation ────────────────────────────────────────
// Heuristic checks run before saving.
// If two or more fail, we regenerate once.
// No second AI call — pure string analysis.

const CLICHE_PHRASES = [
  // generic platitudes
  "at the end of the day",
  "a rollercoaster of emotions",
  "words cannot describe",
  "it was meant to be",
  "everything happens for a reason",
  "the rest is history",
  "a journey of a thousand miles",
  "time heals all wounds",
  "follow your heart",
  "light at the end of the tunnel",
  "in the blink of an eye",
  "through thick and thin",
  "stood the test of time",
  "a blessing in disguise",
  // generic emotional summary language
  "a reminder of",
  "the power of",
  "enduring friendship",
  "mark on my life",
  "shared dreams",
  "will always remain",
  "will never forget",
  "i will never forget",
  "taught me that",
  "showed me that",
  "a testament to",
  "the beauty of",
  "the strength of",
  "the bond we shared",
  "our journey together",
  "the memories we made",
  "forever grateful",
  "changed my life",
  "shaped who i am",
  "beacon of hope",
  "pillar of strength",
]

function hasClichePhrases(text: string): boolean {
  const lower = text.toLowerCase()
  return CLICHE_PHRASES.some((phrase) => lower.includes(phrase))
}

function hasExcessiveRepetition(sections: { text: string }[]): boolean {
  // Check if any two sections share more than 4 consecutive identical words
  const texts = sections.map((s) => s.text.toLowerCase())
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const wordsA = texts[i].split(" ")
      const wordsB = texts[j].split(" ")
      let matchCount = 0
      for (const word of wordsA) {
        if (wordsB.includes(word) && word.length > 4) matchCount++
      }
      // If more than 40% of words overlap between two sections
      if (matchCount / Math.min(wordsA.length, wordsB.length) > 0.4) {
        return true
      }
    }
  }
  return false
}

function hasWeakEnding(closing: string): boolean {
  if (!closing) return true
  if (closing.length < 10) return true
  if (closing.length > 90) return true

  const lower = closing.toLowerCase()

  // Reject copied prompt examples
  if (FORBIDDEN_CLOSINGS.some((example) => lower.includes(example))) return true

  // Check for weak generic phrases
  const weakPhrases = [
    "and that's okay",
    "and that is okay",
    "it will be okay",
    "everything will be fine",
    "things will get better",
    "the end",
    "a reminder of",
    "the power of",
    "will always remain",
    "taught me that",
    "showed me that",
    "a testament to",
  ]
  if (weakPhrases.some((w) => lower.includes(w))) return true

  // Check for abstract noun density
  const abstractNouns = [
    "friendship", "journey", "love", "connection",
    "dreams", "healing", "bond", "lesson", "strength",
    "power", "hope", "growth", "beauty", "resilience",
    "gratitude", "wisdom", "courage", "grace", "spirit",
    "soul", "destiny", "fate", "purpose", "meaning",
  ]

  const words = lower.split(/\s+/)
  const abstractCount = words.filter((w) =>
    abstractNouns.some((a) => w.includes(a))
  ).length

  if (words.length > 0 && abstractCount / words.length > 0.25) return true

  return false
}

const FORBIDDEN_CLOSINGS = [
  "the chair by the window is still yours",
  "the chair by the window is still hers",
  "i never erased the whiteboard",
  "the kettle is cold but i still wake at six",
  "his name is still first in my phone",
  "the playlist ended but i left it on repeat",
  "the porch light is still on",
  "her handwriting is on the grocery list",
  "the voicemail is full but i never cleared it",
  "there's a dent in the passenger seat that fits no one else",
  "the last photo is blurry. i keep it anyway",
]

function validateQuality(parsed: {
  sections: { text: string }[]
  closing: string
}): boolean {
  const fullText = parsed.sections.map((s) => s.text).join(" ")
  const issues = [
    hasClichePhrases(fullText),
    hasExcessiveRepetition(parsed.sections),
    hasWeakEnding(parsed.closing),
  ]
  // Fail if two or more checks fail
  return issues.filter(Boolean).length < 2
}

// ── System prompt ─────────────────────────────────────────────

const buildSystemPrompt = () => `You are Dearly — an emotional experience director, not a story writer.

Your job is to guide someone through a meaningful emotional journey.
You think like a film director: you design the arc first, then write each scene with intention.

You will receive:
- An emotion label
- A theme (visual atmosphere)
- Raw content from the user (their memory, feeling, or thought)
- Optional: who this is for, and the purpose

You must return a JSON object with EXACTLY this structure:
{
  "title": "A short, poetic title. Max 6 words. Not a sentence.",
  "emotionalArc": ["first feeling", "second feeling", "third feeling", "fourth feeling"],
  "sections": [
    {
      "type": "intro",
      "emotionalNote": "the specific feeling this scene should create",
      "pacing": "slow",
      "text": "1 to 3 sentences. Atmospheric. Sets the tone."
    },
    {
      "type": "memory",
      "emotionalNote": "the specific feeling this scene should create",
      "pacing": "slow",
      "text": "1 to 3 sentences. The emotional core. What happened or what was felt."
    },
    {
      "type": "development",
      "emotionalNote": "the specific feeling this scene should create",
      "pacing": "medium",
      "text": "1 to 3 sentences. How it unfolded. What shifted."
    },
    {
      "type": "reflection",
      "emotionalNote": "the specific feeling this scene should create",
      "pacing": "slow",
      "text": "1 to 3 sentences. Looking back. What it means now."
    },
    {
      "type": "closure",
      "emotionalNote": "the specific feeling this scene should create",
      "pacing": "slow",
      "text": "1 to 2 sentences. Where it lands. Not resolution — stillness."
    }
  ],
  "closing": "A single sentence. Concrete. Earned. Not an explanation."
}

Rules for emotional arc:
- Must show movement. Not one emotion repeated four times.
- Examples of good arcs:
  ["curiosity", "warmth", "longing", "acceptance"]
  ["grief", "memory", "tenderness", "release"]
  ["joy", "nostalgia", "bittersweetness", "gratitude"]
- The arc should feel like a journey, not a mood board.

Rules for sections:
- Each section serves a specific emotional purpose defined by its emotionalNote.
- Pacing: "slow" = pause and feel. "medium" = move forward. "fast" = rarely used, only for development.
- No two sections should feel the same.
- Avoid clichés. Write with restraint. Silence has weight.
- Write like a quiet film. Not a pop song. Not a therapy session.
- Prefer concrete images over abstract statements.
- A specific object, place, sound, or habit is worth more than any adjective.

Rules for closing:
- This is the last thing the recipient will feel before the experience ends.
- It must be ONE sentence. Short. Under 16 words ideal.
- It must be CONCRETE — anchored to a specific object, place, sound, habit, gesture, or unfinished moment from the story.
- It must feel EARNED — the journey must lead here naturally.
- It must create STILLNESS — not resolution, not a lesson, not a moral.
- It must NOT explain the meaning of the experience.
- It must NOT summarize the relationship or the feeling.
- It must NOT sound inspirational.
- It must NOT use abstract nouns like: friendship, journey, love, connection, dreams, healing, bond, lesson, strength, power, hope, growth.
- It must NOT contain phrases like:
  "a reminder of"
  "the power of"
  "will always remain"
  "will never forget"
  "taught me that"
  "showed me that"
  "enduring friendship"
  "mark on my life"
  "shared dreams"
  "meant to be"
  "the rest is history"
- It must NOT reuse or imitate any wording from this prompt.
- Think of it as the last frame of a film. Not a voiceover. A frame.
- Bad closings:
  "Their friendship was a testament to the enduring power of shared dreams."
  "She taught me that love never truly fades."
  "The memories we shared will always remain a beacon of hope."
- Bad closings:
  "Their friendship was a testament to the enduring power of shared dreams."
  "She taught me that love never truly fades."
  "The memories we shared will always remain a beacon of hope."
- Good closings:
  "The porch light is still on. No one asked me to leave it."
  "Her handwriting is on the grocery list. I buy the same things."
  "The voicemail is full but I never cleared it."
  "There's a dent in the passenger seat that fits no one else."
  "The last photo is blurry. I keep it anyway."

Rules for output:
- Return ONLY valid JSON. No markdown. No explanation. No code blocks.
- Do not add fields that are not in the schema above.
- Every field is required.`

// ── Build user message ────────────────────────────────────────

function buildUserMessage(
  emotion: string,
  theme: string,
  content: string,
  audience?: string,
  purpose?: string
): string {
  const lines = [
    `Emotion: ${emotion}`,
    `Theme: ${theme}`,
    `Content: ${content}`,
  ]
  if (audience) lines.push(`Who this is for: ${audience}`)
  if (purpose) lines.push(`Purpose: ${purpose}`)
  return lines.join("\n")
}

// ── Generate with optional retry ─────────────────────────────

async function generateExperience(
  userMessage: string,
  attempt = 1
): Promise<{
  title: string
  emotionalArc: string[]
  sections: { type: string; emotionalNote: string; pacing: string; text: string }[]
  closing: string
}> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: userMessage },
    ],
    temperature: attempt === 1 ? 0.8 : 0.7,
    max_tokens: 2000,  // increased from 1500
  })

  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error("No response from AI")

  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()

  // Attempt to extract valid JSON even if response is truncated
  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // Try to find the JSON object within the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0])
      } catch {
        // If still failing on attempt 1, retry
        if (attempt === 1) {
          console.log("JSON parse failed, retrying...")
          return generateExperience(userMessage, 2)
        }
        throw new Error("Failed to parse AI response as JSON")
      }
    } else {
      if (attempt === 1) {
        console.log("No JSON found in response, retrying...")
        return generateExperience(userMessage, 2)
      }
      throw new Error("No JSON found in AI response")
    }
  }

  // Validate quality — regenerate once if below threshold
  if (attempt === 1 && !validateQuality(parsed)) {
    console.log("QUALITY: below threshold, regenerating...")
    return generateExperience(userMessage, 2)
  }

  return parsed
}

// ── Route handler ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { emotion, theme, content, email, audience, purpose } =
      body as GenerateRequest & { email?: string }

    if (!emotion || !theme || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // ── Resolve creatorId ───────────────────────────────────
    const session = await getSession()
    let creatorId: string | null = session.creatorId ?? null

    if (!creatorId && email) {
      const creator = await prisma.creator.findUnique({
        where: { email: email.toLowerCase().trim() },
      })
      if (creator) creatorId = creator.id
    }

    // ── Generate ────────────────────────────────────────────
    const userMessage = buildUserMessage(
      emotion,
      theme,
      content,
      audience,
      purpose
    )

    const parsed = await generateExperience(userMessage)

    // ── Save ────────────────────────────────────────────────
    // Store emotionalArc and closing alongside sections in content JSON
    const experience = await prisma.experience.create({
      data: {
        title: parsed.title,
        content: {
          sections: parsed.sections,
          emotionalArc: parsed.emotionalArc,
          closing: parsed.closing,
        },
        theme,
        emotion,
        ...(creatorId ? { creatorId } : {}),
      },
    })

    return NextResponse.json({
      id: experience.id,
      slug: experience.slug,
      title: parsed.title,
      sections: parsed.sections,
      emotionalArc: parsed.emotionalArc,
      closing: parsed.closing,
      theme,
    })
  } catch (error) {
    console.error("Generate error:", error)
    return NextResponse.json(
      { error: "Failed to generate experience" },
      { status: 500 }
    )
  }
}