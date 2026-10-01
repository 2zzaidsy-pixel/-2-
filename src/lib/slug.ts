const PUNCTUATION = /[\p{P}\p{S}]/gu

export function createSlugger() {
  const seen = new Map<string, number>()

  return function slug(text: string): string {
    const base = text
      .trim()
      .toLowerCase()
      .replace(PUNCTUATION, " ")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    const count = seen.get(base)
    if (count === undefined) {
      seen.set(base, 0)
      return base
    }

    const next = count + 1
    seen.set(base, next)
    return `${base}-${next}`
  }
}

export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(PUNCTUATION, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
