import type { Localized } from "@/lib/i18n"
import content from "@/content/projects.json"

export type ProjectStatus = "live"

export interface LocalizedList {
  en: string[]
  ar: string[]
}

export interface Project {
  id: string
  name: string
  url: string
  monogram: string
  gradient: string
  status: ProjectStatus
  category: Localized
  description: Localized
  highlights: LocalizedList
}

export const projects: Project[] = content.map((project) => ({
  ...project,
  status: project.status as ProjectStatus,
  category: project.category as Localized,
  description: project.description as Localized,
  highlights: project.highlights as LocalizedList,
}))
