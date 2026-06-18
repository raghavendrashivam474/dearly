"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ReactNode, useRef } from "react"

type Props = {
  children: ReactNode
  className?: string
  index?: number
}

export default function Scene({ children, className = "" }: Props) {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Parallax: content moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], [80, -80])

  // Opacity: fade in mid, fade out exit
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  )

  // Scale: slight zoom out as it exits
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

  return (
    <section
      ref={ref}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 relative ${className}`}
    >
      <motion.div
        style={{ y, opacity, scale }}
        className="max-w-3xl w-full text-center"
      >
        {children}
      </motion.div>
    </section>
  )
}