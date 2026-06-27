import { prisma } from "@/lib/prisma"
import ExperienceRenderer from "@/components/ExperienceRenderer"
import QRShare from "@/components/QRShare"
import { notFound } from "next/navigation"
import { parseContent } from "@/lib/content"

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const experience = await prisma.experience.findUnique({
    where: { id },
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