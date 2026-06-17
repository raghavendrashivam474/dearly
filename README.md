# Dearly

> Transform raw emotions, memories, and thoughts into cinematic, shareable web experiences.

---

## What it does

You write what you feel.  
Dearly shapes it into a cinematic, scrollable experience.  
You share a link. Someone feels it.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | Shadcn UI + Radix |
| Animation | Framer Motion |
| AI | Groq (Llama 3.3 70b) |
| Database | Neon PostgreSQL |
| ORM | Prisma 7 |
| Deployment | Vercel |

---

## User Flow
Landing → Create → Input Memory → Select Theme → AI Generates → Preview → Share Link + QR

text


---

## Themes

- Rainy Nostalgia — Dark blue. Rain. Slow fade.
- Midnight Thoughts — Black. Purple glow. Stars.
- Warm Memories — Amber. Polaroid. Film grain.
- Sunset Drive — Orange. Motion. Open roads.
- Cosmic — Deep space. Infinite. Vast.
- Soft Healing — Sage. Gentle. Breathing.

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
 │    ├── create/page.tsx           # Create experience
 │    ├── preview/[id]/page.tsx     # Preview (author view)
 │    ├── p/[slug]/page.tsx         # Public share page
 │    └── api/generate/route.ts     # AI generation endpoint
 ├── components/
 │    ├── ExperienceRenderer.tsx    # Theme + animation renderer
 │    └── QRShare.tsx               # Share bar + QR modal
 ├── lib/
 │    ├── prisma.ts                 # Prisma client
 │    ├── groq.ts                   # Groq AI client
 │    └── themes.ts                 # Theme definitions
 └── types/
      └── experience.ts             # TypeScript types
Roadmap
Sprint 1 — MVP ✅
 Input page
 AI generation
 Experience schema
 Render engine
 6 themes
 Preview page
 Share links
 QR system
Sprint 2 — Media
 Photo upload (Cloudinary)
 Ambient music per theme
 Theme personalization
Sprint 3 — AI Emotional Intelligence
 Mood detection
 Emotional summary
 Reflection generation
Sprint 4 — Memory System
 User accounts
 My experiences
 Timeline view
 Drafts
Sprint 5 — Virality
 Instagram story export
 Share preview cards (OG images)
 QR card download
Environment Variables
Variable	Description
DATABASE_URL	Neon PostgreSQL connection string
GROQ_API_KEY	Groq API key from console.groq.com
NEXT_PUBLIC_APP_URL	Your app URL
License
MIT

Made with stillness.