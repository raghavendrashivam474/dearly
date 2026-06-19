"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")

  let message = "Something didn’t quite land."

  switch (reason) {
    case "missing-token":
      message = "This link seems incomplete."
      break
    case "invalid-token":
      message = "This link isn’t valid."
      break
    case "token-used":
      message = "This link has already been used."
      break
    case "token-expired":
      message = "This link has expired."
      break
    case "server-error":
      message = "Something went wrong on our end."
      break
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-8">
        <h1 className="font-serif text-4xl italic font-light">
          Dearly
        </h1>

        <div className="space-y-3">
          <p className="font-serif text-2xl italic font-light text-zinc-200">
            {message}
          </p>
          <p className="text-zinc-500 text-sm">
            You can request a new sign‑in link anytime.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-white text-zinc-950 text-xs uppercase tracking-widest rounded-full hover:bg-zinc-200 transition"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}