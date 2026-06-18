"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getTheme } from "@/lib/themes"
import AtmosphereLayer from "./atmospheres/AtmosphereLayer"
import { Theme } from "@/types/experience"

type Props = {
  themeId: Theme
  emotion: string
  firstWords: string        // first 8 words of user's content
  onError?: () => void      // called if we need to surface an error
  hasError?: boolean        // parent signals API failure
}

// The fragment sequence — 6 acts across ~8 seconds
// Each fragment is a moment, not a message
type Fragment = {
  id: string
  text: string
  style: "eyebrow" | "emotion" | "body" | "soft"
  enterAt: number           // seconds from scene start
  exitAt: number            // seconds, or null to persist
}

const FRAGMENTS: Fragment[] = [
  {
    id: "received",
    text: "you wrote about",
    style: "eyebrow",
    enterAt: 1.0,
    exitAt: 2.2,
  },
  {
    id: "emotion",
    text: "",              // filled dynamically with user's emotion
    style: "emotion",
    enterAt: 1.8,
    exitAt: 4.0,
  },
  {
    id: "listening",
    text: "we're finding the shape of it",
    style: "soft",
    enterAt: 3.2,
    exitAt: 5.5,
  },
  {
    id: "firstwords",
    text: "",              // filled dynamically with first words
    style: "body",
    enterAt: 4.8,
    exitAt: 7.0,
  },
  {
    id: "ready",
    text: "almost ready",
    style: "eyebrow",
    enterAt: 7.0,
    exitAt: Infinity,      // persists until API resolves
  },
]

// Error fragment — replaces "almost ready" on API failure
const ERROR_FRAGMENT: Fragment = {
  id: "error",
  text: "something got in the way.\nyour words are safe.",
  style: "soft",
  enterAt: 0,
  exitAt: Infinity,
}

const styleClasses: Record<Fragment["style"], string> = {
  eyebrow:
    "text-[10px] uppercase tracking-[0.6em] font-mono opacity-60",
  emotion:
    "font-serif text-5xl md:text-7xl italic font-light leading-[1.05] tracking-tight",
  body:
    "font-serif text-xl md:text-2xl italic font-light leading-relaxed opacity-70",
  soft:
    "font-serif text-2xl md:text-3xl italic font-light leading-relaxed opacity-60",
}

export default function LoadingScene({
  themeId,
  emotion,
  firstWords,
  onError,
  hasError = false,
}: Props) {
  const theme = getTheme(themeId)
  const [elapsed, setElapsed] = useState(0)
  const [visibleFragments, setVisibleFragments] = useState<Set<string>>(
    new Set()
  )
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Build resolved fragments with dynamic content
  const resolvedFragments: Fragment[] = FRAGMENTS.map((f) => {
    if (f.id === "emotion") {
      return {
        ...f,
        text: emotion || "something unnamed",
      }
    }
    if (f.id === "firstwords") {
      return {
        ...f,
        text: firstWords || "",
      }
    }
    return f
  })

  // If error, swap "ready" fragment for error fragment
  const activeFragments: Fragment[] = hasError
    ? [
        ...resolvedFragments.filter(
          (f) => f.id !== "ready" && f.id !== "firstwords"
        ),
        ERROR_FRAGMENT,
      ]
    : resolvedFragments

  // Tick elapsed time every 100ms
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed((e) => e + 0.1)
    }, 100)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Update visible fragments based on elapsed time
  useEffect(() => {
    const nowVisible = new Set<string>()
    activeFragments.forEach((f) => {
      if (elapsed >= f.enterAt && elapsed < f.exitAt) {
        nowVisible.add(f.id)
      }
    })
    setVisibleFragments(nowVisible)
  }, [elapsed, hasError])

  // If error and user has seen the error fragment for 3s, call onError
  // to let the parent decide whether to surface a UI affordance
  const errorShownAt = useRef<number | null>(null)
  useEffect(() => {
    if (hasError) {
      if (errorShownAt.current === null) {
        errorShownAt.current = elapsed
      } else if (elapsed - errorShownAt.current > 3 && onError) {
        onError()
      }
    }
  }, [hasError, elapsed, onError])

  return (
    <div
      className={`
        ${theme.bgGradient} ${theme.text}
        fixed inset-0 flex items-center justify-center
        overflow-hidden
      `}
      style={{ height: "100dvh" }}
    >
      {/* Atmosphere — same as ExperienceRenderer */}
      <AtmosphereLayer theme={themeId} />

      {/* Vignette */}
      <div
        className={`fixed inset-0 pointer-events-none z-[1] ${theme.vignette}`}
      />

      {/* Film grain */}
      <div className="film-grain" />

      {/* Fragment stage */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-6 max-w-2xl w-full">
        <AnimatePresence mode="sync">
          {activeFragments.map((fragment) => {
            if (!visibleFragments.has(fragment.id)) return null

            return (
              <motion.div
                key={fragment.id}
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                transition={{
                  duration: fragment.style === "emotion" ? 1.4 : 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`${styleClasses[fragment.style]} ${theme.text} whitespace-pre-line`}
              >
                {fragment.text}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Subtle pulse beneath fragments — only while not errored */}
        {!hasError && (
          <motion.div
            className="absolute bottom-[-60px] left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: `rgb(${theme.accentRgb})` }}
            />
          </motion.div>
        )}
      </div>

      {/* Error CTA — appears after error fragment has been shown */}
      <AnimatePresence>
        {hasError && elapsed - (errorShownAt.current ?? elapsed) > 2 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onClick={onError}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 text-[10px] uppercase tracking-[0.5em] font-mono opacity-50 hover:opacity-100 transition"
            style={{ color: `rgb(${theme.accentRgb})` }}
          >
            try again
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}