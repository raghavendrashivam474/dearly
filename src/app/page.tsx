"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const themes = [
  { label: "Rainy Nostalgia", color: "bg-blue-500" },
  { label: "Midnight Thoughts", color: "bg-purple-500" },
  { label: "Warm Memories", color: "bg-amber-500" },
  { label: "Sunset Drive", color: "bg-orange-500" },
  { label: "Cosmic", color: "bg-cyan-500" },
  { label: "Soft Healing", color: "bg-emerald-500" },
]

const steps = [
  {
    step: "01",
    title: "Write what you feel",
    desc: "A memory. A confession. A moment you can't let go of.",
  },
  {
    step: "02",
    title: "Choose your world",
    desc: "Six cinematic themes. Each one a different atmosphere.",
  },
  {
    step: "03",
    title: "AI shapes your story",
    desc: "Llama 3.3 structures it into a 5-act cinematic experience.",
  },
  {
    step: "04",
    title: "Share it",
    desc: "A link. A QR code. Someone opens it and feels something.",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 relative">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-zinc-700/10 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <p className="font-serif text-lg text-zinc-300 italic">Dearly</p>
        <Link
          href="/create"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition tracking-widest uppercase"
        >
          Begin →
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xs uppercase tracking-[0.3em] text-zinc-600 mb-8"
        >
          A new kind of memory
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl text-zinc-100 leading-[1.1] tracking-tight max-w-4xl"
        >
          Some feelings
          <br />
          <span className="text-zinc-500 italic">deserve more</span>
          <br />
          than words.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10 text-zinc-500 text-base md:text-lg leading-relaxed max-w-md"
        >
          Write what you feel. Dearly shapes it into a cinematic,
          scrollable experience you can share with anyone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/create"
            className="px-8 py-4 bg-zinc-100 text-zinc-950 rounded-xl text-sm font-medium hover:bg-white transition"
          >
            Create an Experience
          </Link>
          <p className="text-xs text-zinc-600">No account needed. Free forever.</p>
        </motion.div>
      </section>

      {/* THEMES */}
      <section className="relative z-10 px-6 py-32 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.3em] text-zinc-600 mb-16 text-center"
        >
          Six worlds to feel in
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700 transition"
            >
              <div className={`w-2 h-2 rounded-full ${theme.color} mb-4`} />
              <p className="text-sm font-medium text-zinc-200">{theme.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-6 py-32 max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.3em] text-zinc-600 mb-16 text-center"
        >
          How it works
        </motion.p>

        <div className="flex flex-col gap-12">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="flex items-start gap-6"
            >
              <span className="text-xs text-zinc-700 font-mono mt-1 shrink-0">
                {item.step}
              </span>
              <div>
                <p className="text-zinc-200 font-medium mb-2">{item.title}</p>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-10"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-zinc-300 italic max-w-2xl">
            What do you need to say?
          </h2>
          <Link
            href="/create"
            className="px-8 py-4 bg-zinc-100 text-zinc-950 rounded-xl text-sm font-medium hover:bg-white transition"
          >
            Create your experience
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-8 py-8 border-t border-zinc-900 flex items-center justify-between">
        <p className="font-serif text-zinc-700 italic text-sm">Dearly</p>
        <p className="text-xs text-zinc-700 tracking-widest uppercase">
          Made with stillness
        </p>
      </footer>
    </main>
  )
}