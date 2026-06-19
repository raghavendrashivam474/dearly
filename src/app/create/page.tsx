"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { themes } from "@/lib/themes"
import { Theme } from "@/types/experience"
import { ArrowLeft, ArrowRight, Check, Mail, Loader2 } from "lucide-react"
import LoadingScene from "@/components/LoadingScene"

type Step = "identify" | "write" | "feeling" | "theme" | "generating"

export default function CreatePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("identify")
  const [email, setEmail] = useState("")
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)
  const [content, setContent] = useState("")
  const [emotion, setEmotion] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [error, setError] = useState("")
  const [hasApiError, setHasApiError] = useState(false)

  const firstWords = useMemo(() => {
    return content.trim().split(/\s+/).slice(0, 8).join(" ")
  }, [content])

  const handleNext = async () => {
    setError("")

    if (step === "identify") {
      if (email.trim()) {
        if (!email.includes("@")) {
          setError("Please enter a valid email.")
          return
        }

        setIsSendingMagicLink(true)
        try {
          await fetch("/api/auth/magic", {
            method: "POST",
            headers: { "Content-Type": "application/json" },  // fix
            body: JSON.stringify({ email }),
          })
        } catch (err) {
          console.error("Magic link failed", err)
        } finally {
          setIsSendingMagicLink(false)
          setStep("write")
        }
      } else {
        setStep("write")
      }
    } else if (step === "write") {
      if (!content.trim()) {
        setError("Write something. Anything.")
        return
      }
      setStep("feeling")
    } else if (step === "feeling") {
      setStep("theme")
    }
  }

  const handleBack = () => {
    setError("")
    if (step === "write") setStep("identify")
    else if (step === "feeling") setStep("write")
    else if (step === "theme") setStep("feeling")
  }

  const handleErrorSurface = () => {
    setHasApiError(false)
    setStep("theme")
    setError("Something didn't quite land. Try again.")
  }

  const handleGenerate = async () => {
    if (!selectedTheme) {
      setError("Choose a world.")
      return
    }

    setError("")
    setHasApiError(false)
    setStep("generating")

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotion: emotion || "unnamed",
          theme: selectedTheme,
          content,
          email: email.trim() || undefined,  // pass email for creatorId resolution
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setHasApiError(true)
        return
      }
      router.push(`/preview/${data.id}`)
    } catch {
      setHasApiError(true)
    }
  }

  if (step === "generating") {
    return (
      <LoadingScene
        themeId={selectedTheme!}
        emotion={emotion || "unnamed"}
        firstWords={firstWords}
        hasError={hasApiError}
        onError={handleErrorSurface}
      />
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-zinc-700/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link href="/" className="font-serif text-lg text-zinc-400 hover:text-zinc-200 italic transition">
          Dearly
        </Link>

        <div className="flex items-center gap-2">
          {(["identify", "write", "feeling", "theme"] as Step[]).map((s) => (
            <div
              key={s}
              className={`h-px transition-all duration-700 ${
                step === s
                  ? "w-12 bg-zinc-200"
                  : isStepCompleted(step, s)
                  ? "w-6 bg-zinc-500"
                  : "w-6 bg-zinc-800"
              }`}
            />
          ))}
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-start min-h-[calc(100vh-200px)] px-6 pt-20 pb-40">
        <AnimatePresence mode="wait">

          {/* STEP 0: IDENTIFY */}
          {step === "identify" && (
            <motion.div
              key="identify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl"
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-6 font-mono">
                Step 00 — Identity
              </p>
              <h2 className="font-serif text-4xl md:text-5xl italic font-light leading-tight mb-4 text-zinc-100">
                Who should we notify?
              </h2>
              <p className="text-zinc-500 text-base leading-relaxed mb-12">
                Enter your email if you want to know when your experience reaches someone.
                We'll send you a link to your private dashboard. (Optional)
              </p>
              <div className="relative flex items-center">
                <Mail className="absolute left-0 w-5 h-5 text-zinc-700" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  autoFocus
                  className="w-full bg-transparent border-0 border-b border-zinc-800 focus:border-zinc-500 transition text-2xl text-zinc-200 placeholder:text-zinc-700 focus:outline-none pb-4 pl-10 font-serif italic"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 1: WRITE */}
          {step === "write" && (
            <motion.div
              key="write"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl flex flex-col"
              style={{ maxHeight: "calc(100vh - 220px)" }}
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-6 font-mono">
                Step 01 — The page
              </p>
              <h2 className="font-serif text-4xl md:text-5xl italic font-light leading-tight mb-4 text-zinc-100">
                What do you need to say?
              </h2>
              <p className="text-zinc-500 text-base leading-relaxed mb-8">
                A memory. A confession. A thought you can&apos;t shake.
                Write it like no one will read it. We&apos;ll shape it.
              </p>
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 shrink-0">
                <p className="text-xs text-zinc-600 font-mono">{content.length} characters</p>
                <p className="text-xs text-zinc-700 italic">No one sees the draft.</p>
              </div>
              <textarea
                placeholder="Start anywhere..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoFocus
                className="flex-1 min-h-[150px] w-full bg-transparent border-0 text-xl text-zinc-200 placeholder:text-zinc-700 focus:outline-none resize-none font-serif italic leading-relaxed overflow-y-auto"
              />
            </motion.div>
          )}

          {/* STEP 2: FEELING */}
          {step === "feeling" && (
            <motion.div
              key="feeling"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl"
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-6 font-mono">
                Step 02 — The feeling
              </p>
              <h2 className="font-serif text-4xl md:text-5xl italic font-light leading-tight mb-4 text-zinc-100">
                Name what you feel.
              </h2>
              <p className="text-zinc-500 text-base leading-relaxed mb-12">
                Just one word. Optional, but it helps us listen better.
              </p>
              <input
                type="text"
                placeholder="nostalgia, longing, gratitude, grief..."
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-0 border-b border-zinc-800 focus:border-zinc-500 transition text-2xl text-zinc-200 placeholder:text-zinc-700 focus:outline-none pb-4 font-serif italic"
              />
              <div className="mt-8 flex flex-wrap gap-2">
                {["nostalgia", "longing", "gratitude", "grief", "wonder", "regret", "hope", "love"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setEmotion(suggestion)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition ${
                        emotion === suggestion
                          ? "border-zinc-500 bg-zinc-800 text-zinc-100"
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                      }`}
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: THEME */}
          {step === "theme" && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-4xl"
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-6 font-mono">
                Step 03 — The world
              </p>
              <h2 className="font-serif text-4xl md:text-5xl italic font-light leading-tight mb-4 text-zinc-100">
                Where should this live?
              </h2>
              <p className="text-zinc-500 text-base leading-relaxed mb-12">
                Six worlds. Each one a different atmosphere. Choose the one that holds your story.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {themes.map((theme, i) => (
                  <motion.button
                    key={theme.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`group p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      selectedTheme === theme.id
                        ? "border-zinc-400 bg-zinc-800/50"
                        : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                    }`}
                  >
                    {selectedTheme === theme.id && (
                      <motion.div
                        layoutId="selected-check"
                        className="absolute top-3 right-3 w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-zinc-950" />
                      </motion.div>
                    )}
                    <div
                      className="w-2 h-2 rounded-full mb-4"
                      style={{ backgroundColor: `rgb(${theme.accentRgb})` }}
                    />
                    <p className="text-sm font-medium text-zinc-100 mb-2">{theme.label}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-3">{theme.description}</p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
                      {theme.mood}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-red-400 text-sm italic"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Nav */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-20 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-900"
      >
        <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === "identify"}
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200 transition disabled:opacity-0 tracking-widest uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          <button
            onClick={step === "theme" ? handleGenerate : handleNext}
            disabled={isSendingMagicLink}
            className="px-6 py-3 bg-zinc-100 text-zinc-950 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-white transition disabled:opacity-50 flex items-center gap-2"
          >
            {isSendingMagicLink ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Sending...
              </>
            ) : step === "theme" ? (
              <>
                Create Experience
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </main>
  )
}

function isStepCompleted(current: Step, target: Step): boolean {
  const order: Step[] = ["identify", "write", "feeling", "theme", "generating"]
  return order.indexOf(current) > order.indexOf(target)
}