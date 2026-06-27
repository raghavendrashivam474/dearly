"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  emotionalArc?: string[]
  closing?: string | null
}

type Direction = "forward" | "backward"

// Dearly's signature closing — always appears after AI closing
const DEARLY_SIGNATURE = {
  line1: "Some stories stay.",
  line2: "Not on paper.",
  line3: "But in people.",
}

export default function ExperienceRenderer({
  title,
  sections,
  themeId,
  closing,
}: Props) {
  const theme = getTheme(themeId)

  const [currentScene, setCurrentScene] = useState(0)
  const [direction, setDirection] = useState<Direction>("forward")
  const [isRevealed, setIsRevealed] = useState(false)
  const [isInstant, setIsInstant] = useState(false)

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const touchStartTime = useRef<number | null>(null)

  // 0 = title, 1..N = sections, N+1 = final
  const totalScenes = sections.length + 2
  const isTitle = currentScene === 0
  const isFinal = currentScene === totalScenes - 1
  const isContent = !isTitle && !isFinal
  const currentSection = isContent ? sections[currentScene - 1] : null

  useEffect(() => {
    setIsRevealed(false)
    setIsInstant(false)
  }, [currentScene])

  // ── Navigation ──────────────────────────────────────────────

  const goNext = useCallback(() => {
    setDirection("forward")
    setCurrentScene((s) => Math.min(s + 1, totalScenes - 1))
  }, [totalScenes])

  const goPrev = useCallback(() => {
    setDirection("backward")
    setCurrentScene((s) => Math.max(s - 1, 0))
  }, [])

  const handleAdvance = useCallback(() => {
    if (isTitle || isFinal) {
      if (!isFinal) goNext()
      return
    }
    if (isContent) {
      if (!isRevealed) {
        setIsInstant(true)
        setIsRevealed(true)
      } else {
        goNext()
      }
    }
  }, [isTitle, isFinal, isContent, isRevealed, goNext])

  // ── Keyboard ─────────────────────────────────────────────────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault()
        handleAdvance()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleAdvance, goPrev])

  // ── Touch / Swipe ─────────────────────────────────────────────

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchStartTime.current = Date.now()
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (
        touchStartX.current === null ||
        touchStartY.current === null ||
        touchStartTime.current === null
      )
        return

      const deltaX = e.changedTouches[0].clientX - touchStartX.current
      const deltaY = e.changedTouches[0].clientY - touchStartY.current
      const duration = Date.now() - touchStartTime.current

      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)
      const isLongEnough = Math.abs(deltaX) > 50
      const isFastEnough = duration < 400

      if (isHorizontal && isLongEnough && isFastEnough) {
        if (deltaX < 0) {
          handleAdvance()
        } else {
          goPrev()
        }
      }

      touchStartX.current = null
      touchStartY.current = null
      touchStartTime.current = null
    },
    [handleAdvance, goPrev]
  )

  // ── Transition variants ───────────────────────────────────────

  const sceneVariants = {
    enter: (dir: Direction) => ({
      opacity: 0,
      filter: "blur(20px)",
      scale: dir === "forward" ? 1.03 : 0.97,
    }),
    center: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
    },
    exit: (dir: Direction) => ({
      opacity: 0,
      filter: "blur(20px)",
      scale: dir === "forward" ? 0.97 : 1.03,
    }),
  }

  const sceneTransition = {
    duration: 1.2,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  }

  const titleTransition = {
    duration: 1.4,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  }

  return (
    <main
      className={`
        ${theme.bgGradient} ${theme.text}
        relative overflow-hidden
        h-[100dvh]
      `}
      style={{ minHeight: "100dvh" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Atmosphere */}
      <AtmosphereLayer theme={themeId} />

      {/* Vignette */}
      <div
        className={`fixed inset-0 pointer-events-none z-[1] ${theme.vignette}`}
      />

      {/* Film grain */}
      <div className="film-grain" />

      {/* Scene Content */}
      <div
        className={`relative z-10 h-[100dvh] w-full flex justify-center px-6 select-none pointer-events-none ${isFinal
          ? "items-start overflow-y-auto pt-16 pb-24"
          : "items-center"
          }`}
      >        <AnimatePresence mode="wait" custom={direction}>

          {/* TITLE SCENE */}
          {isTitle && (
            <motion.div
              key="title"
              custom={direction}
              variants={sceneVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={titleTransition}
              className="flex flex-col items-center text-center max-w-4xl"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.4 }}
                className="flex items-center gap-4 mb-12 md:mb-16"
              >
                <div
                  className={`w-12 h-px ${theme.accent} opacity-40`}
                  style={{ backgroundColor: "currentColor" }}
                />
                <p
                  className={`text-[10px] uppercase tracking-[0.6em] ${theme.accent} opacity-70 font-mono`}
                >
                  An Experience
                </p>
                <div
                  className={`w-12 h-px ${theme.accent} opacity-40`}
                  style={{ backgroundColor: "currentColor" }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40, filter: "blur(15px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 1.8,
                  delay: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-serif text-4xl md:text-6xl lg:text-8xl leading-[1.05] tracking-[-0.02em] font-light"
              >
                {title}
              </motion.h1>
            </motion.div>
          )}

          {/* CONTENT SCENES */}
          {currentSection && (
            <motion.div
              key={`scene-${currentScene}`}
              custom={direction}
              variants={sceneVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={sceneTransition}
              className="max-w-3xl w-full text-center"
            >
              <SceneText
                text={currentSection.text}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variant={currentSection.type as any}
                accent={theme.accent}
                isInstant={isInstant}
                onRevealComplete={() => setIsRevealed(true)}
              />
            </motion.div>
          )}

          {/* FINAL SCENE */}
          {/* FINAL SCENE */}
          {isFinal && (
            <motion.div
              key="final"
              custom={direction}
              variants={sceneVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={sceneTransition}
              className="text-center max-w-3xl w-full px-4"
            >
              {/* AI-generated closing — unique to this experience */}
              {closing && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="font-serif text-2xl md:text-3xl lg:text-4xl italic font-light leading-[1.35] mb-10 opacity-90"
                >
                  {closing}
                </motion.p>
              )}

              {/* Divider between AI closing and Dearly signature */}
              {closing && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 1.1, delay: 1.0 }}
                  className="w-16 h-px mx-auto mb-10"
                  style={{
                    backgroundColor: `rgb(${theme.accentRgb})`,
                    opacity: 0.25,
                  }}
                />
              )}

              {/* Dearly signature */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: closing ? 1.5 : 0.4,
                }}
                className="font-serif text-3xl md:text-5xl lg:text-6xl italic font-light leading-[1.15] mb-4"
              >
                {DEARLY_SIGNATURE.line1}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: closing ? 2.0 : 1.0,
                }}
                className="font-serif text-3xl md:text-5xl lg:text-6xl italic font-light leading-[1.15] mb-4 opacity-75"
              >
                {DEARLY_SIGNATURE.line2}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: closing ? 2.5 : 1.6,
                }}
                className="font-serif text-3xl md:text-5xl lg:text-6xl italic font-light leading-[1.15] opacity-50"
              >
                {DEARLY_SIGNATURE.line3}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{
                  duration: 1.2,
                  delay: closing ? 3.0 : 2.2,
                }}
                className="mt-14 w-32 h-px mx-auto"
                style={{
                  backgroundColor: `rgb(${theme.accentRgb})`,
                  opacity: 0.4,
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: closing ? 3.4 : 2.6,
                }}
                className="mt-8 space-y-2"
              >
                <p
                  className={`text-[10px] uppercase tracking-[0.6em] ${theme.accent} opacity-60 font-mono`}
                >
                  An experience by
                </p>
                <p className="font-serif text-2xl italic">Dearly</p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1.2,
                  delay: closing ? 3.8 : 3.2,
                }}
                className="mt-10 text-sm italic opacity-50 pb-8"
              >
                Share this with someone who needs to feel it.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click Zones */}
      {currentScene > 0 && (
        <button
          onClick={goPrev}
          aria-label="Previous scene"
          className="fixed top-0 left-0 w-1/2 h-[100dvh] z-20 cursor-w-resize"
        />
      )}

      {!isFinal && (
        <button
          onClick={handleAdvance}
          aria-label="Next scene"
          className="fixed top-0 right-0 w-1/2 h-[100dvh] z-20 cursor-e-resize"
        />
      )}

      {/* Back button */}
      <AnimatePresence>
        {currentScene > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="fixed top-8 left-8 z-40 flex items-center gap-2 text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition font-mono pointer-events-auto"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </motion.button>
        )}
      </AnimatePresence>

      {/* Continue button */}
      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="final"
            custom={direction}
            variants={sceneVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={sceneTransition}
            className="text-center max-w-3xl px-4 max-h-[80dvh] overflow-y-auto pt-6 pb-24"
          >
            {/* AI-generated closing — unique to this experience */}
            {closing && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="font-serif text-2xl md:text-3xl lg:text-4xl italic font-light leading-[1.3] mb-10 opacity-90"
              >
                {closing}
              </motion.p>
            )}

            {/* Divider between AI closing and Dearly signature */}
            {closing && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1.2 }}
                className="w-16 h-px mx-auto mb-10"
                style={{
                  backgroundColor: `rgb(${theme.accentRgb})`,
                  opacity: 0.25,
                }}
              />
            )}

            {/* Dearly signature closing — always present */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.5,
                delay: closing ? 1.8 : 0.4,
              }}
              className="font-serif text-3xl md:text-5xl lg:text-6xl italic font-light leading-[1.15] mb-4"
            >
              {DEARLY_SIGNATURE.line1}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.5,
                delay: closing ? 2.4 : 1.0,
              }}
              className="font-serif text-3xl md:text-5xl lg:text-6xl italic font-light leading-[1.15] mb-4 opacity-75"
            >
              {DEARLY_SIGNATURE.line2}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.5,
                delay: closing ? 3.0 : 1.6,
              }}
              className="font-serif text-3xl md:text-5xl lg:text-6xl italic font-light leading-[1.15] opacity-50"
            >
              {DEARLY_SIGNATURE.line3}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{
                duration: 1.5,
                delay: closing ? 3.6 : 2.2,
              }}
              className="mt-14 w-32 h-px mx-auto"
              style={{
                backgroundColor: `rgb(${theme.accentRgb})`,
                opacity: 0.4,
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.5,
                delay: closing ? 4.0 : 2.6,
              }}
              className="mt-8 space-y-2"
            >
              <p
                className={`text-[10px] uppercase tracking-[0.6em] ${theme.accent} opacity-60 font-mono`}
              >
                An experience by
              </p>
              <p className="font-serif text-2xl italic">Dearly</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.5,
                delay: closing ? 4.4 : 3.2,
              }}
              className="mt-10 text-sm italic opacity-50"
            >
              Share this with someone who needs to feel it.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 pointer-events-auto">
        {Array.from({ length: totalScenes }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentScene ? "forward" : "backward")
              setCurrentScene(i)
            }}
            aria-label={`Go to scene ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${i === currentScene
              ? "w-8 bg-current opacity-90"
              : i < currentScene
                ? "w-1.5 bg-current opacity-50"
                : "w-1.5 bg-current opacity-20"
              }`}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <AnimatePresence>
        {isTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="fixed bottom-10 left-8 z-30 hidden md:flex flex-col gap-1 text-[10px] uppercase tracking-widest opacity-30 font-mono"
          >
            <p>← → to navigate</p>
            <p>or swipe on mobile</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}