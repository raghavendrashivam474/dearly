"use client"

import { motion } from "framer-motion"
import { Section } from "@/types/experience"
import { getTheme } from "@/lib/themes"

type Props = {
  title: string
  sections: Section[]
  themeId: any
}

export default function ExperienceRenderer({
  title,
  sections,
  themeId,
}: Props) {
  const theme = getTheme(themeId)

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} px-6 py-20 transition-colors duration-700`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={`text-4xl md:text-5xl font-light mb-24 leading-tight ${theme.accent}`}
        >
          {title}
        </motion.h1>

        {/* Sections */}
        <div className="space-y-32">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className={`p-8 rounded-2xl border ${theme.border} ${theme.card}`}
            >
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {section.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* End Card */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center text-xs tracking-widest uppercase opacity-50"
        >
          Created with Dearly
        </motion.div>
      </div>
    </div>
  )
}