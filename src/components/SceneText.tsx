"use client"

import { motion } from "framer-motion"

type Variant = "intro" | "memory" | "development" | "reflection" | "closure"

type Props = {
  text: string
  variant: Variant
  accent: string
}

const variantStyles: Record<Variant, string> = {
  intro: "font-serif text-4xl md:text-6xl lg:text-7xl italic font-light leading-[1.15] tracking-tight",
  memory: "font-serif text-3xl md:text-5xl font-normal leading-[1.2] tracking-tight",
  development: "font-sans text-xl md:text-2xl font-light leading-[1.6] tracking-wide max-w-2xl mx-auto",
  reflection: "font-serif text-2xl md:text-4xl italic font-light leading-[1.3] opacity-90",
  closure: "font-serif text-3xl md:text-5xl italic font-light leading-[1.2] tracking-tight",
}

const variantLabels: Record<Variant, string> = {
  intro: "I. Opening",
  memory: "II. The Memory",
  development: "III. What Happened",
  reflection: "IV. Looking Back",
  closure: "V. Where It Lands",
}

const splitWords = (text: string) => text.split(" ")

export default function SceneText({ text, variant, accent }: Props) {
  const words = splitWords(text)

  return (
    <div className="space-y-14">
      {/* Chapter Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="flex items-center justify-center gap-4"
      >
        <div
          className={`w-8 h-px ${accent} opacity-40`}
          style={{ backgroundColor: "currentColor" }}
        />
        <p className={`text-[10px] uppercase tracking-[0.5em] ${accent} opacity-70 font-mono`}>
          {variantLabels[variant]}
        </p>
        <div
          className={`w-8 h-px ${accent} opacity-40`}
          style={{ backgroundColor: "currentColor" }}
        />
      </motion.div>

      {/* Text — word by word reveal */}
      <p className={`${variantStyles[variant]} whitespace-pre-line`}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.7,
              delay: 0.6 + i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        ))}
      </p>
    </div>
  )
}