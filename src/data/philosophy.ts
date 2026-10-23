import type { Localized } from "@/lib/i18n"
import content from "@/content/philosophy.json"

export interface Philosophy {
  id: string
  quote: Localized
  author: Localized
  context: Localized
}

export const philosophies: Philosophy[] = content.philosophies.map((item) => ({
  ...item,
  quote: item.quote as Localized,
  author: item.author as Localized,
  context: item.context as Localized,
}))

export const personalPhilosophy = {
  statement: content.personalPhilosophy.statement as Localized,
}
