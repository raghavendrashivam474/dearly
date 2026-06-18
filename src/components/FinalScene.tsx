"use client"

import { motion } from "framer-motion"

type Props = {
  accent: string
}

export default function FinalScene({ accent }: Props) {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative py-32">
      <div className="text-center max-w-3xl space-y-8">
        {/* Line 1 */}
        <motion.p
          initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-7xl italic font-light leading-[1.15]"
        >
          Some stories stay.
        </motion.p>

        {/* Line 2 */}
        <motion.p
          initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-7xl italic font-light leading-[1.15] opacity-75"
        >
          Not on paper.
        </motion.p>

        {/* Line 3 */}
        <motion.p
          initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 2, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-7xl italic font-light leading-[1.15] opacity-50"
        >
          But in people.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 2, delay: 3 }}
          className={`!mt-32 w-32 h-px ${accent} opacity-40 mx-auto`}
          style={{ backgroundColor: "currentColor" }}
        />

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 2, delay: 3.6 }}
          className="!mt-12 space-y-3"
        >
          <p className={`text-[10px] uppercase tracking-[0.6em] ${accent} opacity-60 font-mono`}>
            An experience by
          </p>
          <p className="font-serif text-3xl italic">Dearly</p>
        </motion.div>

        {/* Subtle call to share */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 2, delay: 4.2 }}
          className="!mt-24 text-sm text-current opacity-50 font-light italic"
        >
          Share this with someone who needs to feel it.
        </motion.p>
      </div>
    </section>
  )
}