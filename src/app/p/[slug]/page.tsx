import { prisma } from "@/lib/prisma"
import ExperienceRenderer from "@/components/ExperienceRenderer"
import QRShare from "@/components/QRShare"
import { notFound } from "next/navigation"

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const experience = await prisma.experience.findUnique({
    where: { slug },
  })

  if (!experience) return notFound()

  return (
    <>
      <ExperienceRenderer
        title={experience.title}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sections={experience.content as any}
        themeId={experience.theme}
      />
      <QRShare slug={experience.slug} title={experience.title} />
    </>
  )
}