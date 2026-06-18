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

text


Each experience is rendered as full-screen cinematic scenes with:
- Atmospheric particle layers (rain, stars, embers, dust)
- Word-by-word text reveals
- Theme-specific gradients, vignettes, and film grain
- Click-driven navigation (left half = back, right half = forward)
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
└── Step 4 — Generating...
↓
AI generates structured story
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
| Midnight Thoughts | Vast. Quiet. Honest. | Twinkling stars |
| Warm Memories | Warm. Tender. Held. | Floating embers |
| Sunset Drive | Free. Moving. Open. | Drifting embers |
| Cosmic | Infinite. Distant. Vast. | Star field |
| Soft Healing | Gentle. Returning. Soft. | Drifting dust |

---

## Design Philosophy

Every UX decision answered one question:

> **Does this make the user feel something?**

If yes — kept.
If only informational — removed.

This translated into:
- Typography as emotion (italic for reflection, bold for memory)
- Click-driven pacing (forces presence, not skimming)
- Atmosphere as backdrop, not decoration
- Film grain + vignettes for analog warmth
- Cubic-bezier easing for cinematic motion

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
 │    ├── api/generate/route.ts     # Groq AI endpoint
 │    ├── layout.tsx                # Root layout + fonts
 │    └── globals.css               # Tailwind + custom vignettes
 ├── components/
 │    ├── ExperienceRenderer.tsx    # Click-driven scene engine
 │    ├── SceneText.tsx             # Typography variants per type
 │    ├── QRShare.tsx               # Multi-channel share system
 │    └── atmospheres/
 │         ├── AtmosphereLayer.tsx
 │         ├── RainAtmosphere.tsx
 │         ├── StarsAtmosphere.tsx
 │         ├── EmbersAtmosphere.tsx
 │         └── DustAtmosphere.tsx
 ├── lib/
 │    ├── prisma.ts                 # Neon adapter
 │    ├── groq.ts                   # Groq client
 │    └── themes.ts                 # 6 theme configurations
 └── types/
      └── experience.ts             # Shared TS types
Keyboard Shortcuts
While viewing an experience:

Key	Action
→ Space Enter	Next scene
←	Previous scene
Click left half of screen	Previous scene
Click right half of screen	Next scene
Click any progress dot	Jump to scene
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
Sprint 3 — Media
 Photo upload (Cloudinary)
 Ambient audio per theme
 Theme personalization
Sprint 4 — Memory System
 User authentication
 My Experiences dashboard
 Drafts + Timeline
 Edit existing experiences
Sprint 5 — Virality
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