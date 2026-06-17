export type SectionType = 
  | "intro" 
  | "memory" 
  | "development" 
  | "reflection" 
  | "closure"

export type Section = {
  type: SectionType
  text: string
}

export type Theme = 
  | "rainy-nostalgia"
  | "midnight-thoughts"
  | "warm-memories"
  | "sunset-drive"
  | "cosmic"
  | "soft-healing"

export type Experience = {
  id: string
  slug: string
  title: string
  theme: Theme
  emotion: string
  sections: Section[]
  createdAt: string
}

export type GenerateRequest = {
  emotion: string
  theme: Theme
  content: string
}

export type GenerateResponse = {
  title: string
  sections: Section[]
  theme: Theme
}