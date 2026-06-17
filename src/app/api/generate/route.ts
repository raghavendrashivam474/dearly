import { NextRequest, NextResponse } from "next/server"
import { groq } from "@/lib/groq"
import { prisma } from "@/lib/prisma"
import { GenerateRequest } from "@/types/experience"

const SYSTEM_PROMPT = `You are Dearly.

You convert user emotions into cinematic, minimal, emotionally authentic experiences.

You will receive:
- An emotion label
- A theme
- Raw content from the user

You must return a JSON object with this exact structure:
{
  "title": "A short, poetic title (max 6 words)",
  "sections": [
    { "type": "intro", "text": "Opening scene. Set the atmosphere." },
    { "type": "memory", "text": "The core memory or feeling." },
    { "type": "development", "text": "How it unfolded. What it meant." },
    { "type": "reflection", "text": "Looking back at it now." },
    { "type": "closure", "text": "Where you land. Not resolution. Just stillness." }
  ]
}

Rules:
- Return ONLY valid JSON. No markdown. No explanation. No code blocks.
- Each section text: 1 to 3 sentences max.
- Avoid clichés, manipulation, excessive romance.
- Focus on atmosphere, pacing, emotional authenticity.
- Write like a quiet film. Not a pop song.`

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()
    const { emotion, theme, content } = body

    if (!emotion || !theme || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Emotion: ${emotion}\nTheme: ${theme}\nContent: ${content}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    const raw = completion.choices[0]?.message?.content

    if (!raw) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      )
    }

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const parsed = JSON.parse(cleaned)

    const experience = await prisma.experience.create({
      data: {
        title: parsed.title,
        content: parsed.sections,
        theme: theme,
        emotion: emotion,
      },
    })

    return NextResponse.json({
      id: experience.id,
      slug: experience.slug,
      title: parsed.title,
      sections: parsed.sections,
      theme: theme,
    })
  } catch (error) {
    console.error("Generate error:", error)
    return NextResponse.json(
      { error: "Failed to generate experience" },
      { status: 500 }
    )
  }
}