"use client"

import { useState } from "react"
import QRCode from "react-qr-code"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, QrCode, X } from "lucide-react"

type Props = {
  slug: string
}

export default function QRShare({ slug }: Props) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Share Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl px-5 py-3 shadow-2xl"
        >
          {/* URL */}
          <p className="text-xs text-zinc-500 max-w-[180px] truncate">
            {shareUrl}
          </p>

          {/* Divider */}
          <div className="w-px h-4 bg-zinc-700" />

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-4 bg-zinc-700" />

          {/* QR Button */}
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white transition"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>
        </motion.div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center gap-6 max-w-sm w-full mx-4"
            >
              {/* Close */}
              <div className="w-full flex justify-between items-center">
                <p className="text-sm text-zinc-300 font-medium">
                  Scan to open
                </p>
                <button
                  onClick={() => setShowQR(false)}
                  className="text-zinc-600 hover:text-zinc-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-xl">
                <QRCode
                  value={shareUrl}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#09090b"
                />
              </div>

              {/* URL */}
              <p className="text-xs text-zinc-600 text-center break-all">
                {shareUrl}
              </p>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copied</span>
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
    </>
  )
}