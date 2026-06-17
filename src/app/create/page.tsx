"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { themes } from "@/lib/themes"
import { Theme } from "@/types/experience"
import { Loader2 } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [emotion, setEmotion] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError("Write something first.")
      return
    }
    if (!selectedTheme) {
      setError("Select a theme.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotion: emotion || "unnamed",
          theme: selectedTheme,
          content: content,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong.")
        return
      }

      router.push(`/preview/${data.id}`)
    } catch {
      setError("Failed to connect. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-tight text-zinc-100">
            Create an Experience
          </h1>
          <p className="mt-2 text-zinc-500 text-sm">
            Write what you feel. We&apos;ll shape it into something cinematic.
          </p>
        </div>

        {/* Emotion Tag */}
        <div className="mb-8">
          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">
            What is this feeling? (optional)
          </label>
          <input
            type="text"
            placeholder="nostalgia, grief, longing, gratitude..."
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition"
          />
        </div>

        {/* Content Input */}
        <div className="mb-10">
          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">
            Describe your memory or emotion
          </label>
          <textarea
            placeholder="I miss how things used to feel between us..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition resize-none"
          />
          <p className="mt-2 text-xs text-zinc-600">
            {content.length} characters
          </p>
        </div>

        {/* Theme Selection */}
        <div className="mb-10">
          <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-4">
            Select a Theme
          </label>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedTheme === theme.id
                    ? "border-zinc-400 bg-zinc-800"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <p className="text-sm font-medium text-zinc-200">
                  {theme.label}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {theme.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-sm mb-6"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <motion.button
          onClick={handleGenerate}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full py-4 bg-zinc-100 text-zinc-950 rounded-xl font-medium text-sm tracking-wide hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating your experience...
            </>
          ) : (
            "Create Experience"
          )}
        </motion.button>
      </motion.div>
    </main>
  )
}