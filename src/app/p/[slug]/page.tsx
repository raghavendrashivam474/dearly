import { prisma } from "@/lib/prisma"
import { Suspense } from "react"
import ExperienceRenderer from "@/components/ExperienceRenderer"
import QRShare from "@/components/QRShare"
import { notFound } from "next/navigation"
import { parseContent } from "@/lib/content"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const experience = await prisma.experience.findUnique({
    where: { slug },
    select: { title: true, theme: true },
  })

  if (!experience) {
    return { title: "Experience not found — Dearly" }
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

async function ExperienceContent({ slug }: { slug: string }) {
  const experience = await prisma.experience.findUnique({
    where: { slug },
  })

  if (!experience) return notFound()

  const { sections, emotionalArc, closing } = parseContent(experience.content)

  return (
    <>
      <ExperienceRenderer
        title={experience.title}
        sections={sections}
        themeId={experience.theme}
        emotionalArc={emotionalArc}
        closing={closing}
      />
      <QRShare slug={experience.slug} title={experience.title} />
    </>
  )
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <Suspense
      fallback={
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