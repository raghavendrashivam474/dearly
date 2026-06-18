"use client"

import { useState, useEffect } from "react"
import QRCode from "react-qr-code"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, QrCode, X, Share2, MessageCircle } from "lucide-react"

type Props = {
  slug: string
  title?: string
}

export default function QRShare({ slug, title = "An Experience" }: Props) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}`
  const shareText = `${title} — an experience on Dearly`

  // Detect mobile and native share capability after mount
  // coarse pointer = touch primary = mobile
  useEffect(() => {
    const mobile = window.matchMedia("(pointer: coarse)").matches
    setIsMobile(mobile)
    setHasNativeShare(!!navigator.share)
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\n\n${shareUrl}`)
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  const handleNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          url: shareUrl,
        })
      } catch {
        // user cancelled — do nothing, don't fall back to copy
        // cancelling native share is an intentional action
      }
    } else {
      handleCopy()
    }
  }

  return (
    <>
      {/* Floating Share Bar */}
      <div className="fixed top-6 right-6 z-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex items-center gap-1 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl"
        >
          {/* Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-300 hover:text-white transition rounded-full hover:bg-white/5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="tracking-wide">Share</span>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-1 overflow-hidden"
              >
                <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />

                {isMobile ? (
                  // ── Mobile order ─────────────────────────────
                  // Native share first — opens OS share sheet
                  // WhatsApp second — most common direct share
                  // Copy last — fallback
                  // QR hidden — useless on mobile
                  <>
                    {hasNativeShare && (
                      <button
                        onClick={handleNative}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white transition rounded-full hover:bg-white/5 shrink-0"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    )}

                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white transition rounded-full hover:bg-white/5 shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white transition rounded-full hover:bg-white/5 shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Link</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  // ── Desktop order ─────────────────────────────
                  // Copy first — most natural on desktop
                  // WhatsApp second
                  // QR third — scan with phone to open on mobile
                  // Native last — labeled "More" on desktop
                  <>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white transition rounded-full hover:bg-white/5 shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white transition rounded-full hover:bg-white/5 shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => setShowQR(true)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white transition rounded-full hover:bg-white/5 shrink-0"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR</span>
                    </button>

                    {hasNativeShare && (
                      <button
                        onClick={handleNative}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white transition rounded-full hover:bg-white/5 shrink-0"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>More</span>
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* QR Modal — desktop only, never renders on mobile */}
      {!isMobile && (
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
              onClick={() => setShowQR(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-950 border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-8 max-w-sm w-full"
              >
                {/* Header */}
                <div className="w-full flex justify-between items-start">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-mono mb-2">
                      Scan to open on your phone
                    </p>
                    <p className="font-serif text-xl italic text-zinc-200">
                      {title}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQR(false)}
                    className="text-zinc-600 hover:text-zinc-300 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* QR Code */}
                <div className="bg-white p-5 rounded-2xl">
                  <QRCode
                    value={shareUrl}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#09090b"
                  />
                </div>

                {/* URL */}
                <p className="text-xs text-zinc-600 text-center break-all font-mono">
                  {shareUrl}
                </p>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="w-full py-3 bg-white text-zinc-950 text-sm rounded-xl transition hover:bg-zinc-200 flex items-center justify-center gap-2 font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
}