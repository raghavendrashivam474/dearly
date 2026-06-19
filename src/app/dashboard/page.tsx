import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
const session = await getSession()

if (!session.creatorId) {
redirect("/")
}

const experiences = await prisma.experience.findMany({
where: { creatorId: session.creatorId },
orderBy: { createdAt: "desc" },
})

return (
<main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-20">
<div className="max-w-3xl mx-auto space-y-12">
<div className="space-y-3">
<h1 className="font-serif text-4xl italic font-light">
Your Dearly
</h1>
<p className="text-zinc-500 text-sm">
{session.email}
</p>
</div>

text

    <div className="space-y-6">
      {experiences.length === 0 ? (
        <p className="text-zinc-500 italic">
          You haven’t created anything yet.
        </p>
      ) : (
        experiences.map((exp) => (
          <Link
            key={exp.id}
            href={`/preview/${exp.id}`}
            className="block p-6 border border-zinc-800 rounded-2xl hover:border-zinc-600 transition"
          >
            <p className="font-serif text-xl italic">
              {exp.title}
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              {new Date(exp.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))
      )}
    </div>
  </div>
</main>
)
}