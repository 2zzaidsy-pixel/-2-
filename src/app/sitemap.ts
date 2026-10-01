import type { MetadataRoute } from "next"
import { getAllArticles } from "@/lib/articles"
import { siteConfig } from "@/data/site"
import { defaultLocale, locales } from "@/lib/i18n"

export const dynamic = "force-static"

// Anchored to the newest article so the sitemap does not report a fresh
// lastModified for untouched pages on every build.
const buildDate = new Date(
  getAllArticles(defaultLocale).reduce(
    (latest, article) => {
      const date = new Date(article.frontmatter.updatedDate ?? article.frontmatter.date)
      return date > latest ? date : latest
    },
    new Date("2026-01-01")
  )
)

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/projects", "/blog"]

  const entries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified: buildDate,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: {
          en: `${siteConfig.url}/en${path}`,
          ar: `${siteConfig.url}/ar${path}`,
        },
      },
    }))
  )

  // Articles are standalone per language, so they advertise no cross-language
  // alternates: the same slug does not exist in the other language.
  const articleEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllArticles(locale).map((article) => ({
      url: `${siteConfig.url}/${locale}/blog/${article.slug}`,
      lastModified: new Date(article.frontmatter.updatedDate ?? article.frontmatter.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }))
  )

  return [...entries, ...articleEntries]
}
