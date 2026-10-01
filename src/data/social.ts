import type { Localized } from "@/lib/i18n"
import { siteConfig } from "@/data/site"

export type SocialPlatformId = "youtube" | "instagram" | "facebook"

export interface SocialPlatform {
  id: SocialPlatformId
  name: string
  handle: string
  url: string
  color: string
  description: Localized
  followers: number | null
}

export const socialPlatforms: SocialPlatform[] = [
  {
    id: "youtube",
    name: "YouTube",
    handle: "@zaid_al_kade",
    url: siteConfig.social.youtube,
    color: "from-red-500 to-rose-600",
    description: {
      en: "Longer build videos: what I made, what broke, and how I fixed it.",
      ar: "فيديوهات بناء أطول: ما صنعته، وما الذي تعطّل، وكيف أصلحته.",
    },
    followers: null,
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@zaid_al_kade",
    url: siteConfig.social.instagram,
    color: "from-pink-500 to-fuchsia-600",
    description: {
      en: "Short breakdowns, behind the scenes, and one idea worth keeping.",
      ar: "شروحات قصيرة، وكواليس العمل، وفكرة واحدة تستحق أن تُحفظ.",
    },
    followers: null,
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "2zzaid",
    url: siteConfig.social.facebook,
    color: "from-blue-600 to-indigo-600",
    description: {
      en: "Longer posts and open discussion about psychology and building.",
      ar: "منشورات أطول، ونقاش مفتوح عن علم النفس والبناء.",
    },
    followers: null,
  },
]
