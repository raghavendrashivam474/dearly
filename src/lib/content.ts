import { Section } from "@/types/experience"

type StoredContent =
  | Section[]  // old shape — flat array
  | {          // new shape — object
      sections: Section[]
      emotionalArc?: string[]
      closing?: string
    }

export function parseContent(content: unknown): {
  sections: Section[]
  emotionalArc: string[]
  closing: string | null
} {
  if (Array.isArray(content)) {
    // Old shape — experiences created before emotion engine
    return {
      sections: content as Section[],
      emotionalArc: [],
      closing: null,
    }
  }

  if (content && typeof content === "object") {
    const obj = content as {
      sections?: Section[]
      emotionalArc?: string[]
      closing?: string
    }
    return {
      sections: obj.sections ?? [],
      emotionalArc: obj.emotionalArc ?? [],
      closing: obj.closing ?? null,
    }
  }

  // Fallback — should never happen
  return { sections: [], emotionalArc: [], closing: null }
}