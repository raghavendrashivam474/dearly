"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Section } from "@/types/experience"
import { getTheme } from "@/lib/themes"
import SceneText from "./SceneText"
import AtmosphereLayer from "./atmospheres/AtmosphereLayer"
import { ChevronRight, ChevronLeft } from "lucide-react"

type Props = {
  title: string
  sections: Section[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themeId: any
}

// Total scenes = title (0) + sections + final (last)
export default function ExperienceRenderer({
  title,
  sections,
  themeId,
}: Props) {
  const theme = getTheme(themeId)
  const [currentScene, setCurrentScene] = useState(0)

  // 0 = title, 1..N = sections, N+1 = final
  const totalScenes = sections.length + 2
  const isTitle = currentScene === 0
  const isFinal = currentScene === totalScenes - 1
  const currentSection = !isTitle && !isFinal ? sections[currentScene - 1] : null

  const next = useCallback(() => {
    setCurrentScene((s) => Math.min(s + 1, totalScenes - 1))
  }, [totalScenes])

  const prev = useCallback(() => {
    setCurrentScene((s) => Math.max(s - 1, 0))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault()
        next()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [next, prev])

  return (
    <main
      className={`${theme.bgGradient} ${theme.text} relative min-h-screen h-screen overflow-hidden`}
    >
      {/* Atmosphere */}
      <AtmosphereLayer theme={themeId} />

      {/* Vignette */}
      <div className={`fixed inset-0 pointer-events-none z-[1] ${theme.vignette}`} />

      {/* Film grain */}
      <div className="film-grain" />

      {/* Scene Content */}
      <div className="relative z-10 h-screen w-full flex items-center justify-center px-6 select-none pointer-events-none">
        <AnimatePresence mode="wait">
          {/* TITLE SCENE */}
          {isTitle && (
            <motion.div
              key="title"
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center max-w-5xl"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.4 }}
                className="flex items-center gap-4 mb-16"
              >
                <div className={`w-12 h-px ${theme.accent} opacity-40`} style={{ backgroundColor: "currentColor" }} />
                <p className={`text-[10px] uppercase tracking-[0.6em] ${theme.accent} opacity-70 font-mono`}>
                  An Experience
                </p>
                <div className={`w-12 h-px ${theme.accent} opacity-40`} style={{ backgroundColor: "currentColor" }} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40, filter: "blur(15px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-[-0.02em] font-light"
              >
                {title}
              </motion.h1>
            </motion.div>
          )}

          {/* SCENE TEXT */}
          {currentSection && (
            <motion.div
              key={`scene-${currentScene}`}
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl w-full text-center"
            >
              <SceneText
                text={currentSection.text}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variant={currentSection.type as any}
                accent={theme.accent}
              />
            </motion.div>
          )}

          {/* FINAL SCENE */}
          {isFinal && (
            <motion.div
              key="final"
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-3xl"
            >
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.4 }}
                className="font-serif text-4xl md:text-6xl italic font-light leading-[1.15] mb-6"
              >
                Some stories stay.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="font-serif text-4xl md:text-6xl italic font-light leading-[1.15] mb-6 opacity-75"
              >
                Not on paper.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1.6 }}
                className="font-serif text-4xl md:text-6xl italic font-light leading-[1.15] opacity-50"
              >
                But in people.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.5, delay: 2.2 }}
                className={`mt-20 w-32 h-px ${theme.accent} opacity-40 mx-auto`}
                style={{ backgroundColor: "currentColor" }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 2.6 }}
                className="mt-10 space-y-2"
              >
                <p className={`text-[10px] uppercase tracking-[0.6em] ${theme.accent} opacity-60 font-mono`}>
                  An experience by
                </p>
                <p className="font-serif text-2xl italic">Dearly</p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 3.2 }}
                className="mt-16 text-sm italic opacity-50"
              >
                Share this with someone who needs to feel it.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Click Zones — left half = back, right half = next */}
      <button
        onClick={prev}
        disabled={currentScene === 0}
        aria-label="Previous scene"
        className="fixed top-0 left-0 w-1/2 h-screen z-20 cursor-w-resize disabled:cursor-default disabled:pointer-events-none"
      />
      <button
        onClick={next}
        disabled={isFinal}
        aria-label="Next scene"
        className="fixed top-0 right-0 w-1/2 h-screen z-20 cursor-e-resize disabled:cursor-default disabled:pointer-events-none"
      />
      {/* Back button — top left */}
      <AnimatePresence>
        {currentScene > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            className="fixed top-8 left-8 z-40 flex items-center gap-2 text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition font-mono pointer-events-auto"          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </motion.button>
        )}
      </AnimatePresence>

      {/* Continue button — bottom right */}
      <AnimatePresence>
        {!isFinal && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: isTitle ? 2 : 1.5 }}
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            className="fixed bottom-12 right-8 z-40 flex items-center gap-3 group pointer-events-auto">
            <span className={`text-xs uppercase tracking-[0.4em] ${theme.accent} opacity-70 group-hover:opacity-100 transition font-mono`}>
              {isTitle ? "Begin" : "Continue"}
            </span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`w-8 h-8 rounded-full border ${theme.accent} opacity-70 group-hover:opacity-100 flex items-center justify-center transition`}
              style={{ borderColor: "currentColor" }}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress dots — bottom center */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 pointer-events-auto">
        {Array.from({ length: totalScenes }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentScene(i)}
            className={`h-1 rounded-full transition-all duration-500 ${i === currentScene
              ? "w-8 bg-current opacity-90"
              : i < currentScene
                ? "w-1.5 bg-current opacity-50"
                : "w-1.5 bg-current opacity-20"
              }`}
          />
        ))}
      </div>

      {/* Keyboard hint — bottom left, only on title */}
      <AnimatePresence>
        {isTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="fixed bottom-12 left-8 z-30 hidden md:flex flex-col gap-1 text-[10px] uppercase tracking-widest opacity-30 font-mono"
          >
            <p>← → arrows to navigate</p>
            <p>or click continue</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}