import { Theme } from "@/types/experience"

export type ThemeConfig = {
  id: Theme
  label: string
  description: string

  // Background — Layered gradients for depth
  bg: string
  bgGradient: string
  vignette: string

  // Text
  text: string
  textMuted: string

  // Accent — Used for chapter labels, dividers
  accent: string
  accentRgb: string

  // Atmosphere
  atmosphere: "rain" | "stars" | "embers" | "dust" | "cosmic" | "soft"
  atmosphereColor: string

  // Mood
  mood: string
}

export const themes: ThemeConfig[] = [
  {
    id: "rainy-nostalgia",
    label: "Rainy Nostalgia",
    description: "A blue evening. The window. The silence after.",
    bg: "bg-[#0a1628]",
    bgGradient: "bg-gradient-to-b from-[#0a1628] via-[#0d1b35] to-[#050c1a]",
    vignette: "bg-radial-vignette-blue",
    text: "text-blue-50",
    textMuted: "text-blue-200/60",
    accent: "text-blue-300",
    accentRgb: "147, 197, 253",
    atmosphere: "rain",
    atmosphereColor: "147, 197, 253",
    mood: "Wistful. Slow. Inward.",
  },
  {
    id: "midnight-thoughts",
    label: "Midnight Thoughts",
    description: "3 AM. The ceiling. The questions.",
    bg: "bg-[#0a0612]",
    bgGradient: "bg-gradient-to-b from-[#0a0612] via-[#140924] to-[#050208]",
    vignette: "bg-radial-vignette-purple",
    text: "text-purple-50",
    textMuted: "text-purple-200/60",
    accent: "text-purple-300",
    accentRgb: "216, 180, 254",
    atmosphere: "stars",
    atmosphereColor: "216, 180, 254",
    mood: "Vast. Quiet. Honest.",
  },
  {
    id: "warm-memories",
    label: "Warm Memories",
    description: "Golden hour. Old photographs. Laughter.",
    bg: "bg-[#1a0e05]",
    bgGradient: "bg-gradient-to-b from-[#1a0e05] via-[#2a1608] to-[#0d0703]",
    vignette: "bg-radial-vignette-amber",
    text: "text-amber-50",
    textMuted: "text-amber-200/60",
    accent: "text-amber-300",
    accentRgb: "252, 211, 77",
    atmosphere: "embers",
    atmosphereColor: "252, 211, 77",
    mood: "Warm. Tender. Held.",
  },
  {
    id: "sunset-drive",
    label: "Sunset Drive",
    description: "The road. The sky burning. Windows down.",
    bg: "bg-[#1a0a05]",
    bgGradient: "bg-gradient-to-b from-[#2a0e08] via-[#1a0a05] to-[#0a0402]",
    vignette: "bg-radial-vignette-orange",
    text: "text-orange-50",
    textMuted: "text-orange-200/60",
    accent: "text-orange-300",
    accentRgb: "253, 186, 116",
    atmosphere: "embers",
    atmosphereColor: "253, 186, 116",
    mood: "Free. Moving. Open.",
  },
  {
    id: "cosmic",
    label: "Cosmic",
    description: "The void. The stars. The smallness.",
    bg: "bg-[#020410]",
    bgGradient: "bg-gradient-to-b from-[#020410] via-[#080820] to-[#000208]",
    vignette: "bg-radial-vignette-cyan",
    text: "text-cyan-50",
    textMuted: "text-cyan-200/60",
    accent: "text-cyan-300",
    accentRgb: "103, 232, 249",
    atmosphere: "cosmic",
    atmosphereColor: "103, 232, 249",
    mood: "Infinite. Distant. Vast.",
  },
  {
    id: "soft-healing",
    label: "Soft Healing",
    description: "Morning light. Tea. The slow return.",
    bg: "bg-[#051a13]",
    bgGradient: "bg-gradient-to-b from-[#082218] via-[#051a13] to-[#020a07]",
    vignette: "bg-radial-vignette-emerald",
    text: "text-emerald-50",
    textMuted: "text-emerald-200/60",
    accent: "text-emerald-300",
    accentRgb: "110, 231, 183",
    atmosphere: "soft",
    atmosphereColor: "167, 243, 208",
    mood: "Gentle. Returning. Soft.",
  },
]

export const getTheme = (id: Theme): ThemeConfig => {
  return themes.find((t) => t.id === id) ?? themes[0]
}