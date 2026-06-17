import { Theme } from "@/types/experience"

export type ThemeConfig = {
  id: Theme
  label: string
  description: string
  bg: string
  text: string
  accent: string
  card: string
  border: string
}

export const themes: ThemeConfig[] = [
  {
    id: "rainy-nostalgia",
    label: "Rainy Nostalgia",
    description: "Dark blue. Rain. Slow fade.",
    bg: "bg-slate-900",
    text: "text-slate-200",
    accent: "text-blue-400",
    card: "bg-slate-800/50 backdrop-blur-sm",
    border: "border-slate-700",
  },
  {
    id: "midnight-thoughts",
    label: "Midnight Thoughts",
    description: "Black. Purple glow. Stars.",
    bg: "bg-zinc-950",
    text: "text-zinc-200",
    accent: "text-purple-400",
    card: "bg-zinc-900/50 backdrop-blur-sm",
    border: "border-purple-900",
  },
  {
    id: "warm-memories",
    label: "Warm Memories",
    description: "Amber. Polaroid. Film grain.",
    bg: "bg-amber-950",
    text: "text-amber-100",
    accent: "text-amber-400",
    card: "bg-amber-900/40 backdrop-blur-sm",
    border: "border-amber-800",
  },
  {
    id: "sunset-drive",
    label: "Sunset Drive",
    description: "Orange. Motion. Open roads.",
    bg: "bg-orange-950",
    text: "text-orange-100",
    accent: "text-orange-400",
    card: "bg-orange-900/40 backdrop-blur-sm",
    border: "border-orange-800",
  },
  {
    id: "cosmic",
    label: "Cosmic",
    description: "Deep space. Infinite. Vast.",
    bg: "bg-indigo-950",
    text: "text-indigo-100",
    accent: "text-cyan-400",
    card: "bg-indigo-900/40 backdrop-blur-sm",
    border: "border-indigo-800",
  },
  {
    id: "soft-healing",
    label: "Soft Healing",
    description: "Sage. Gentle. Breathing.",
    bg: "bg-emerald-950",
    text: "text-emerald-100",
    accent: "text-emerald-400",
    card: "bg-emerald-900/40 backdrop-blur-sm",
    border: "border-emerald-800",
  },
]

export const getTheme = (id: Theme): ThemeConfig => {
  return themes.find((t) => t.id === id) ?? themes[0]
}