"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useRef } from "react"

type Variant = "intro" | "memory" | "development" | "reflection" | "closure"

type Props = {
  text: string
  variant: Variant
  accent: string
  isInstant?: boolean
  onRevealComplete?: () => void
}

const variantStyles: Record<Variant, string> = {
  intro:
    "font-serif text-3xl md:text-5xl lg:text-6xl italic font-light leading-[1.15] tracking-tight",
  memory:
    "font-serif text-2xl md:text-4xl lg:text-5xl font-normal leading-[1.2] tracking-tight",
  development:
    "font-sans text-lg md:text-xl lg:text-2xl font-light leading-[1.6] tracking-wide max-w-2xl mx-auto",
  reflection:
    "font-serif text-xl md:text-3xl lg:text-4xl italic font-light leading-[1.3] opacity-90",
  closure:
    "font-serif text-2xl md:text-4xl lg:text-5xl italic font-light leading-[1.2] tracking-tight",
}

const variantLabels: Record<Variant, string> = {
  intro: "I. Opening",
  memory: "II. The Memory",
  development: "III. What Happened",
  reflection: "IV. Looking Back",
  closure: "V. Where It Lands",
}

// Emotional pacing — ms per word
// Configurable here, not hardcoded into animation logic
const revealSpeed: Record<Variant, number> = {
  intro: 60,
  memory: 85,        // slowest — this is the emotional core
  development: 40,   // fastest — connective tissue, moves story forward
  reflection: 110,   // second slowest — needs silence around each word
  closure: 65,
}

const baseDelay = 0.6 // seconds before first word appears

export default function SceneText({
  text,
  variant,
  accent,
  isInstant = false,
  onRevealComplete,
}: Props) {
  const words = text.split(" ")
  const msPerWord = revealSpeed[variant]
  const totalRevealDuration = baseDelay + (words.length * msPerWord) / 1000

  // Track whether we've fired onRevealComplete
  const completeFired = useRef(false)

  useEffect(() => {
    // Reset on new scene
    completeFired.current = false

    if (isInstant) {
      // No animation — fire immediately
      if (onRevealComplete) {
        onRevealComplete()
      }
      return
    }

    // Fire after full reveal duration
    const timer = setTimeout(() => {
      if (!completeFired.current) {
        completeFired.current = true
        if (onRevealComplete) {
          onRevealComplete()
        }
      }
    }, totalRevealDuration * 1000)

    return () => clearTimeout(timer)
  }, [text, isInstant, totalRevealDuration, onRevealComplete])

  return (
    <div className="space-y-14">
      {/* Chapter Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex items-center justify-center gap-4"
      >
        <div
          className={`w-8 h-px ${accent} opacity-40`}
          style={{ backgroundColor: "currentColor" }}
        />
        <p
          className={`text-[10px] uppercase tracking-[0.5em] ${accent} opacity-70 font-mono`}
        >
          {variantLabels[variant]}
        </p>
        <div
          className={`w-8 h-px ${accent} opacity-40`}
          style={{ backgroundColor: "currentColor" }}
        />
      </motion.div>

      {/* Text */}
      <p className={`${variantStyles[variant]} whitespace-pre-line`}>
        {words.map((word, i) => {
          const wordDelay = baseDelay + (i * msPerWord) / 1000

          return isInstant ? (
            // Instant — no animation, just render
            <span
              key={i}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </span>
          ) : (
            // Animated reveal
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: wordDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          )
        })}
      </p>
    </div>
  )
}