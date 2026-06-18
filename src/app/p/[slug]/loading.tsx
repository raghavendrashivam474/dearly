export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "#09090b" }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Wordmark */}
        <p
          className="font-serif text-2xl italic"
          style={{ color: "rgba(244, 244, 245, 0.9)" }}
        >
          Dearly
        </p>

        {/* Pulse */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-12 h-12 rounded-full animate-ping"
            style={{ background: "rgba(244, 244, 245, 0.08)" }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "rgba(244, 244, 245, 0.4)" }}
          />
        </div>

        {/* Copy */}
        <p
          className="text-[10px] uppercase tracking-[0.6em] font-mono"
          style={{ color: "rgba(244, 244, 245, 0.3)" }}
        >
          Opening experience
        </p>
      </div>
    </div>
  )
}