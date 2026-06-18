"use client"

import { motion, useScroll, useSpring } from "framer-motion"

type Props = {
  accent: string
}

export default function ScrollProgress({ accent }: Props) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
      style={{
        scaleX,
        backgroundColor: "currentColor",
      }}
    >
      <div className={`w-full h-full ${accent} opacity-70`} />
    </motion.div>
  )
}