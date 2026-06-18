import Link from "next/link"

export default function NotFound() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "#09090b" }}
    >
      <div className="flex flex-col items-center gap-10 text-center px-6">
        {/* Wordmark */}
        <p
          className="font-serif text-2xl italic"
          style={{ color: "rgba(244, 244, 245, 0.9)" }}
        >
          Dearly
        </p>

        <div className="space-y-4 max-w-sm">
          <p
            className="font-serif text-3xl md:text-4xl italic font-light leading-[1.2]"
            style={{ color: "rgba(244, 244, 245, 0.9)" }}
          >
            This experience may have moved on.
          </p>
          <p
            className="text-sm font-light leading-relaxed"
            style={{ color: "rgba(244, 244, 245, 0.4)" }}
          >
            Some things aren't meant to stay forever.
          </p>
        </div>

        {/* Divider */}
        <div
          className="w-16 h-px"
          style={{ background: "rgba(244, 244, 245, 0.15)" }}
        />

        <Link
          href="/create"
          className="text-[10px] uppercase tracking-[0.5em] font-mono transition-opacity hover:opacity-100"
          style={{ color: "rgba(244, 244, 245, 0.4)" }}
        >
          Create your own
        </Link>
      </div>
    </div>
  )
}