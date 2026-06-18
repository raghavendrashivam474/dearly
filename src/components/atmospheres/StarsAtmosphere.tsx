"use client"

import { useEffect, useRef } from "react"

type Props = {
  color?: string
}

export default function StarsAtmosphere({ color = "192, 132, 252" }: Props) {
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
    const count = isLowEnd ? 100 : 200

    const stars: {
      x: number
      y: number
      r: number
      opacity: number
      twinkle: number
    }[] = []

    for (let i = 0; i < count; i++) {
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
        ctx.fillStyle = `rgba(${color}, 0.8)`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
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