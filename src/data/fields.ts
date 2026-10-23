import type { Localized } from "@/lib/i18n"
import content from "@/content/fields.json"

export type FieldIcon =
  | "brain"
  | "users"
  | "trending-up"
  | "activity"
  | "lightbulb"
  | "landmark"
  | "network"

export interface Field {
  id: string
  title: Localized
  description: Localized
  icon: FieldIcon
  color: string
}

export const fields: Field[] = content.map((field) => ({
  ...field,
  title: field.title as Localized,
  description: field.description as Localized,
  icon: field.icon as FieldIcon,
}))
