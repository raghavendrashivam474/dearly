"use client"

import { useEffect, useRef } from "react"

export default function EmbersAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const embers: { x: number; y: number; r: number; speed: number; drift: number; opacity: number }[] = []
    for (let i = 0; i < 80; i++) {
      embers.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * canvas.height,
        r: 1 + Math.random() * 2,
        speed: 0.5 + Math.random() * 1.5,
        drift: -0.5 + Math.random(),
        opacity: 0.3 + Math.random() * 0.5,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      embers.forEach((e) => {
        ctx.beginPath()
        ctx.globalAlpha = e.opacity
        const gradient = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3)
        gradient.addColorStop(0, "rgba(251, 191, 36, 1)")
        gradient.addColorStop(1, "rgba(251, 191, 36, 0)")
        ctx.fillStyle = gradient
        ctx.arc(e.x, e.y, e.r * 3, 0, Math.PI * 2)
        ctx.fill()

        e.y -= e.speed
        e.x += e.drift

        if (e.y < -10) {
          e.y = canvas.height + 10
          e.x = Math.random() * canvas.width
        }
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}