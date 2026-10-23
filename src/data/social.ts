import type { Localized } from "@/lib/i18n"
import content from "@/content/social.json"

export type SocialPlatformId = string

export interface SocialPlatform {
  id: SocialPlatformId
  name: string
  handle: string
  url: string
  color: string
  description: Localized
  followers: number | null
}

export const socialPlatforms: SocialPlatform[] = content.map((platform) => ({
  ...platform,
  description: platform.description as Localized,
  followers: platform.followers ?? null,
}))
