"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

type Props = {
  title: string
  accent: string
}

export default function SceneTitle({ title, accent }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])

  return (
    <section
      ref={ref}
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative"
    >
      <motion.div
        style={{ opacity, y, scale }}
        className="flex flex-col items-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className={`w-12 h-px ${accent} opacity-40`} style={{ backgroundColor: "currentColor" }} />
          <p className={`text-[10px] uppercase tracking-[0.6em] ${accent} opacity-70 font-mono`}>
            An Experience
          </p>
          <div className={`w-12 h-px ${accent} opacity-40`} style={{ backgroundColor: "currentColor" }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-6xl md:text-8xl lg:text-9xl text-center max-w-5xl leading-[1.05] tracking-[-0.02em] font-light"
        >
          {title}
        </motion.h1>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 3 }}
        style={{ opacity }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-mono">
          Scroll to begin
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-current opacity-30"
        />
      </motion.div>
    </section>
  )
}