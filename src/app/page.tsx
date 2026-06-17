"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-800 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Content */}
      <div className="text-center max-w-xl relative z-10">
        
        {/* Logo */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-widest text-zinc-500 mb-6"
        >
          Dearly
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-6xl font-light tracking-tight leading-tight mb-6"
        >
          Some feelings deserve
          <br />
          <span className="text-zinc-400">more than words.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-zinc-500 text-base leading-relaxed mb-10 max-w-md mx-auto"
        >
          Transform your memories and emotions into cinematic,
          shareable experiences. In seconds.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            href="/create"
            className="inline-block px-8 py-4 bg-zinc-100 text-zinc-950 rounded-xl text-sm font-medium hover:bg-white transition"
          >
            Create Experience
          </Link>
        </motion.div>

        {/* Themes preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-2"
        >
          {[
            "Rainy Nostalgia",
            "Midnight Thoughts",
            "Warm Memories",
            "Sunset Drive",
            "Cosmic",
            "Soft Healing",
          ].map((theme) => (
            <span
              key={theme}
              className="px-3 py-1 text-xs text-zinc-500 border border-zinc-800 rounded-full"
            >
              {theme}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 text-xs text-zinc-700 tracking-widest uppercase"
      >
        Made with stillness
      </motion.p>
    </main>
  )
}