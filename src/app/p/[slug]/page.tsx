import { prisma } from "@/lib/prisma"
import { Suspense } from "react"
import ExperienceRenderer from "@/components/ExperienceRenderer"
import QRShare from "@/components/QRShare"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// ── Metadata for share previews ───────────────────────────────
// WhatsApp, iMessage, Twitter, Slack all read these
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const experience = await prisma.experience.findUnique({
    where: { slug },
    // Only fetch what metadata needs — title and theme
    select: { title: true, theme: true },
  })

  if (!experience) {
    return {
      title: "Experience not found — Dearly",
    }
  }

  const description = "A cinematic experience made just for you."

  return {
    title: `${experience.title} — Dearly`,
    description,
    openGraph: {
      title: experience.title,
      description,
      siteName: "Dearly",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: experience.title,
      description,
    },
  }
}

// ── Experience fetcher ────────────────────────────────────────
async function ExperienceContent({ slug }: { slug: string }) {
  const experience = await prisma.experience.findUnique({
    where: { slug },
  })

  if (!experience) return notFound()

  return (
    <>
      <ExperienceRenderer
        title={experience.title}
        sections={experience.content as any}
        themeId={experience.theme}
      />
      <QRShare slug={experience.slug} title={experience.title} />
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <Suspense
      fallback={
        // Inline fallback — same as loading.tsx but scoped to this boundary
        // loading.tsx handles route-level loading
        // This Suspense handles component-level streaming
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: "#09090b" }}
        >
          <div className="flex flex-col items-center gap-8">
            <p
              className="font-serif text-2xl italic"
              style={{ color: "rgba(244, 244, 245, 0.9)" }}
            >
              Dearly
            </p>
            <div className="relative flex items-center justify-center">
              <div
                className="absolute w-12 h-12 rounded-full animate-ping"
                style={{ background: "rgba(244, 244, 245, 0.08)" }}
              />
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "rgba(244, 244, 245, 0.4)" }}
              />
            </div>
            <p
              className="text-[10px] uppercase tracking-[0.6em] font-mono"
              style={{ color: "rgba(244, 244, 245, 0.3)" }}
            >
              Opening experience
            </p>
          </div>
        </div>
      }
    >
      <ExperienceContent slug={slug} />
    </Suspense>
  )
}