export type SectionType =
  | "intro"
  | "memory"
  | "development"
  | "reflection"
  | "closure"

export type SectionPacing = "slow" | "medium" | "fast"

export type Section = {
  type: SectionType
  text: string
  // v5 — emotion engine additions
  emotionalNote?: string   // what feeling this scene should leave
  pacing?: SectionPacing   // informs word reveal speed
}

export type Theme =
  | "rainy-nostalgia"
  | "midnight-thoughts"
  | "warm-memories"
  | "sunset-drive"
  | "cosmic"
  | "soft-healing"

export type Audience =
  | "myself"
  | "friend"
  | "family"
  | "someone-i-miss"
  | "future-me"
  | "never-send"

export type Purpose =
  | "gratitude"
  | "farewell"
  | "celebration"
  | "reflection"
  | "healing"
  | "appreciation"

export type Experience = {
  id: string
  slug: string
  title: string
  theme: Theme
  emotion: string
  sections: Section[]
  emotionalArc?: string[]   // e.g. ["curiosity", "warmth", "hope"]
  closing?: string          // AI-generated experience-specific closing line
  createdAt: string
}

export type GenerateRequest = {
  emotion: string
  theme: Theme
  content: string
  audience?: Audience       // optional context
  purpose?: Purpose         // optional context
}

export type GenerateResponse = {
  title: string
  sections: Section[]
  theme: Theme
  emotionalArc?: string[]
  closing?: string
}