"use client"

import { motion } from "framer-motion"

type Props = {
  accent: string
}

export default function SceneDivider({ accent }: Props) {
  return (
    <div className="relative h-32 w-full flex items-center justify-center">
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className={`w-px h-24 ${accent} opacity-30`}
        style={{ backgroundColor: "currentColor" }}
      />
    </div>
  )
}