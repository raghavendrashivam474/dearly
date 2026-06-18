<div align="center">

# Dearly

### Some feelings deserve more than words.

Transform raw emotions, memories, and thoughts into cinematic, shareable web experiences.

[Live Demo](https://dearly.vercel.app) · [Report Bug](https://github.com/raghavendrashivam474/dearly/issues) · [Request Feature](https://github.com/raghavendrashivam474/dearly/issues)

</div>

---

## The Idea

You write what you feel.  
Dearly shapes it into a cinematic, click-through experience.  
You share a link.  
Someone opens it and stops scrolling.

This isn't a blog. This isn't a journal app.  
It's a way to turn a moment into something someone can *feel*.

---

## Demo

Write a memory → Choose a world → AI shapes a 5-act story → Share a link

Each experience is rendered as full-screen cinematic scenes with:

- Atmospheric particle layers (rain, stars, embers, dust)
- Word-by-word text reveals with emotional pacing per section type
- Theme-specific gradients, vignettes, and film grain
- Click-driven navigation (left half = back, right half = forward)
- Swipe navigation on mobile
- Multi-channel sharing (Link, WhatsApp, QR, Native Share)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | Shadcn UI + Radix |
| Animation | Framer Motion |
| AI | Groq API (Llama 3.3 70b versatile) |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma 7 + Neon adapter |
| Particles | Custom HTML5 Canvas (no external libs) |
| Fonts | Inter + Playfair Display |
| Deployment | Vercel |

---

## User Flow
Landing
↓
Create
├── Step 1 — Write what you feel
├── Step 2 — Name the feeling
├── Step 3 — Choose your world
└── Step 4 — Loading Scene (theme atmosphere starts immediately)
↓
AI generates structured story via Groq
↓
Click-driven cinematic experience
├── Title Scene
├── I. Opening
├── II. The Memory
├── III. What Happened
├── IV. Looking Back
├── V. Where It Lands
└── Final Scene
↓
Share: Link · WhatsApp · QR · Native

text


---

## Six Worlds

Each theme is a fully realized atmosphere — different colors, gradients, particles, and mood.

| Theme | Mood | Atmosphere |
|---|---|---|
| Rainy Nostalgia | Wistful. Slow. Inward. | Falling rain |
| Midnight Thoughts | Vast. Quiet. Honest. | Twinkling stars (purple) |
| Warm Memories | Warm. Tender. Held. | Floating embers |
| Sunset Drive | Free. Moving. Open. | Drifting embers |
| Cosmic | Infinite. Distant. Vast. | Star field (cyan) |
| Soft Healing | Gentle. Returning. Soft. | Drifting dust |

---

## Design Philosophy

Every UX decision answered one question:

> **Does this make the user feel something?**

If yes — kept.  
If only informational — removed.

This translated into:

- Typography as emotion (italic for reflection, bold for memory)
- Emotional pacing — memory scenes reveal slower than development scenes
- Click-driven navigation forces presence, not skimming
- Loading time becomes the first scene, not dead time
- Atmosphere as backdrop, not decoration
- Film grain + vignettes for analog warmth
- Cubic-bezier easing for cinematic motion

---

## What Changed in v3

v2 was a cinematic experience.  
v3 is about protecting the emotion that was already there.

| Area | Change |
|---|---|
| Loading | Step 4 is now a cinematic scene — theme atmosphere starts immediately, user's words appear as fragments while AI generates |
| Mobile | Full swipe navigation, `100dvh` viewport fix for iOS Safari, adaptive particle counts on low-end devices |
| Pacing | Word reveal speed varies by section type — memory: 85ms/word, reflection: 110ms/word, development: 40ms/word |
| Transitions | Direction-aware scale shifts — forward feels like entering, backward feels like surfacing |
| Reveal | Two-click pattern — first click completes reveal instantly, second click advances scene |
| Share | Mobile-aware share order — Native Share first on mobile, QR hidden on mobile |
| Public page | Streaming with Suspense, emotional 404, OG metadata for share previews |
| Fonts | Playfair Display uses `font-display: block` to prevent layout shift during word reveals |
| Atmospheres | `visualViewport` for correct canvas sizing on iOS, particle count scales to device capability |

---

## Local Setup

### 1. Clone

```bash
git clone https://github.com/raghavendrashivam474/dearly.git
cd dearly
2. Install dependencies
Bash

npm install
3. Environment variables
Create a .env file in the root:

env

DATABASE_URL="your-neon-postgresql-connection-string"
GROQ_API_KEY="your-groq-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
Get your keys:

Neon Postgres → neon.tech
Groq API → console.groq.com
4. Setup database
Bash

npx prisma generate
npx prisma db push
5. Run
Bash

npm run dev
Open http://localhost:3000

Project Structure
text

src/
 ├── app/
 │    ├── page.tsx                  # Landing page
 │    ├── create/page.tsx           # 4-step journal flow
 │    ├── preview/[id]/page.tsx     # Author preview
 │    ├── p/[slug]/page.tsx         # Public shareable page
 │    ├── p/[slug]/loading.tsx      # Route-level load state
 │    ├── p/[slug]/not-found.tsx    # Emotional 404
 │    ├── api/generate/route.ts     # Groq AI endpoint
 │    ├── layout.tsx                # Root layout + fonts
 │    └── globals.css               # Tailwind + custom vignettes + grain
 ├── components/
 │    ├── ExperienceRenderer.tsx    # Click-driven scene engine
 │    ├── SceneText.tsx             # Typography variants + reveal system
 │    ├── LoadingScene.tsx          # Cinematic loading experience
 │    ├── QRShare.tsx               # Multi-channel share system
 │    └── atmospheres/
 │         ├── AtmosphereLayer.tsx  # Theme → atmosphere router
 │         ├── RainAtmosphere.tsx
 │         ├── StarsAtmosphere.tsx
 │         ├── EmbersAtmosphere.tsx
 │         └── DustAtmosphere.tsx
 ├── lib/
 │    ├── prisma.ts                 # Neon adapter
 │    ├── groq.ts                   # Groq client
 │    └── themes.ts                 # 6 theme configurations
 └── types/
      └── experience.ts             # Shared TypeScript types
Navigation
While viewing an experience:

Input	Action
→ Space Enter	Next scene / complete reveal
←	Previous scene
Swipe left	Next scene (mobile)
Swipe right	Previous scene (mobile)
Click right half	Next scene / complete reveal
Click left half	Previous scene
Progress dots	Jump to any scene
Reveal behavior: On content scenes, the first interaction completes the word-by-word reveal instantly. The second interaction advances to the next scene. This protects reading, not waiting.

Environment Variables
Variable	Required	Description
DATABASE_URL	Yes	Neon PostgreSQL connection string
GROQ_API_KEY	Yes	Groq API key for AI generation
NEXT_PUBLIC_APP_URL	Yes	Public URL for share links and QR codes
Roadmap
Sprint 1 — MVP ✅

 Input page
 AI generation (Groq)
 Experience schema
 Render engine
 6 themes
 Preview page
 Share links
 QR system
Sprint 2 — Cinematic Overhaul ✅

 Full-screen scene architecture
 Custom Canvas atmosphere particles
 Emotional typography hierarchy
 Theme gradients + vignettes + film grain
 Click-driven page navigation
 Word-by-word text reveals
 Multi-channel share (Link, WhatsApp, QR, Native)
 Journal-like create flow
Sprint 3 — Polish ✅

 Loading as cinematic Scene 0
 Mobile hardening (dvh, swipe, adaptive particles)
 Emotional pacing per section type
 Direction-aware scene transitions
 Two-click reveal protection
 Mobile-aware share priority
 Streaming public page with OG metadata
 Emotional 404 and load states
 Font FOUT prevention on Playfair Display
Sprint 4 — Media

 Photo upload (Cloudinary)
 Ambient audio per theme
 Theme personalization
Sprint 5 — Memory System

 User authentication
 My Experiences dashboard
 Drafts + Timeline
 Edit existing experiences
Sprint 6 — Virality

 OG image generation
 Instagram Story export
 Downloadable QR cards
 Share preview cards
Contributing
Pull requests welcome. For major changes, please open an issue first to discuss what you'd like to change.

License
MIT © Raghavendra Singh

<div align="center">
Made with stillness.

</div> ```