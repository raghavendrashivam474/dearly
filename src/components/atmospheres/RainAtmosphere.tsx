"use client"

import { useEffect, useRef } from "react"

export default function RainAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    // Fix 1 — use visualViewport for correct mobile height
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.visualViewport?.height ?? window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)
    window.visualViewport?.addEventListener("resize", resize)

    // Fix 2 — scale particle count to device capability
    const isLowEnd = navigator.hardwareConcurrency <= 4
    const count = isLowEnd ? 80 : 150

    const drops: {
      x: number
      y: number
      speed: number
      length: number
      opacity: number
    }[] = []

    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 4 + Math.random() * 6,
        length: 10 + Math.random() * 20,
        opacity: 0.1 + Math.random() * 0.3,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "rgba(147, 197, 253, 0.4)"
      ctx.lineWidth = 1

      drops.forEach((d) => {
        ctx.beginPath()
        ctx.globalAlpha = d.opacity
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x, d.y + d.length)
        ctx.stroke()

        d.y += d.speed
        if (d.y > canvas.height) {
          d.y = -d.length
          d.x = Math.random() * canvas.width
        }
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      window.visualViewport?.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}