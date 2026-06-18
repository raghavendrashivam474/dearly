"use client"

import { useEffect, useRef } from "react"

export default function StarsAtmosphere() {
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

    const stars: { x: number; y: number; r: number; opacity: number; twinkle: number }[] = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        opacity: Math.random(),
        twinkle: 0.005 + Math.random() * 0.02,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((s) => {
        s.opacity += s.twinkle
        if (s.opacity > 1 || s.opacity < 0) s.twinkle = -s.twinkle

        ctx.beginPath()
        ctx.globalAlpha = Math.abs(s.opacity)
        ctx.fillStyle = "rgba(192, 132, 252, 0.8)"
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
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