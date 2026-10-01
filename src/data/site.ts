export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zerotime.vercel.app").replace(
  /\/$/,
  ""
)

export const siteConfig = {
  name: "Zaid",
  url: siteUrl,
  image: "/profile.jpg",
  description:
    "Zaid builds practical web products and writes about psychology, human behavior, and critical thinking.",
  contact: {
    email: "zerotime2025@gmail.com",
  },
  social: {
    youtube: "https://www.youtube.com/@zaid_al_kade",
    instagram: "https://www.instagram.com/zaid_al_kade",
    facebook: "https://www.facebook.com/2zzaid",
  },
} as const

export type SiteConfig = typeof siteConfig
