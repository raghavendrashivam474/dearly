"use client"

import { useEffect, useRef } from "react"

type Props = {
  color?: string
}

export default function DustAtmosphere({ color = "255, 255, 255" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.visualViewport?.height ?? window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)
    window.visualViewport?.addEventListener("resize", resize)

    const isLowEnd = navigator.hardwareConcurrency <= 4
    const count = isLowEnd ? 30 : 60

    const particles: {
      x: number
      y: number
      r: number
      vx: number
      vy: number
      opacity: number
    }[] = []

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.5 + Math.random() * 1.5,
        vx: -0.2 + Math.random() * 0.4,
        vy: -0.2 + Math.random() * 0.4,
        opacity: 0.1 + Math.random() * 0.3,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = `rgba(${color}, 0.6)`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      window.visualViewport?.removeEventListener("resize", resize)
    }
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}