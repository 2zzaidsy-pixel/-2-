import type { MetadataRoute } from "next"
import { getAllArticles, getPairedArticleSlugs } from "@/lib/articles"
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

  // Articles are written as translated pairs sharing one slug, so a paired
  // article advertises its counterpart in the other language. An article
  // without a counterpart stays standalone.
  const paired = new Set(getPairedArticleSlugs())
  const articleEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllArticles(locale).map((article) => ({
      url: `${siteConfig.url}/${locale}/blog/${article.slug}`,
      lastModified: new Date(article.frontmatter.updatedDate ?? article.frontmatter.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      ...(paired.has(article.slug)
        ? {
            alternates: {
              languages: {
                en: `${siteConfig.url}/en/blog/${article.slug}`,
                ar: `${siteConfig.url}/ar/blog/${article.slug}`,
              },
            },
          }
        : {}),
    }))
  )

  return [...entries, ...articleEntries]
}
