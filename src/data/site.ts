import content from "@/content/site.json"

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zerotime.vercel.app").replace(
  /\/$/,
  ""
)

export const siteConfig = {
  ...content,
  url: siteUrl,
} as const

export type SiteConfig = typeof siteConfig
