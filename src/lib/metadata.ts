import type { Metadata } from "next"
import { defaultLocale, getMessages, isLocale, localeOgLocale, locales, type Locale } from "@/lib/i18n"
import { siteConfig } from "@/data/site"

interface ConstructMetadataInput {
  locale: Locale
  title?: string
  description?: string
  path?: string
  type?: "website" | "article"
  publishedTime?: string
  /**
   * Language alternates for this page. Defaults to the same path in every
   * locale, which is only valid for pages that actually exist in all of them.
   * Pass `null` for pages with no counterpart in other locales (e.g. articles,
   * whose slugs are language-specific).
   */
  alternates?: Record<Locale, string> | null
}

/** Path with its leading locale segment stripped, e.g. `/en/blog` -> `/blog`. */
function pathWithoutLocale(path: string): string {
  const segments = path.split("/").filter(Boolean)
  const rest = isLocale(segments[0]) ? segments.slice(1) : segments
  return rest.length > 0 ? `/${rest.join("/")}` : ""
}

function buildLanguageAlternates(path?: string): Record<string, string> {
  const rest = path ? pathWithoutLocale(path) : ""
  const languages: Record<string, string> = {}

  for (const locale of locales) {
    languages[locale] = `${siteConfig.url}/${locale}${rest}`
  }
  languages["x-default"] = languages[defaultLocale]
  return languages
}

export function constructMetadata({
  locale,
  title,
  description,
  path,
  type = "website",
  publishedTime,
  alternates,
}: ConstructMetadataInput = { locale: "en" }): Metadata {
  const messages = getMessages(locale)
  const name = messages["site.name"]
  const tagline = messages["site.tagline"]
  const pageTitle = title ?? `${name} — ${tagline}`
  const pageDescription = description ?? messages["site.description"]
  const canonical = path ? `${siteConfig.url}${path}` : siteConfig.url

  const languageAlternates =
    alternates === null
      ? undefined
      : (alternates as Record<string, string> | undefined) ??
        buildLanguageAlternates(path)

  return {
    metadataBase: new URL(siteConfig.url),
    title: title ? `${title} | ${name}` : pageTitle,
    description: pageDescription,
    alternates: {
      canonical,
      ...(languageAlternates ? { languages: languageAlternates } : {}),
    },
    openGraph: {
      title: title ?? pageTitle,
      description: pageDescription,
      url: canonical,
      siteName: name,
      locale: localeOgLocale[locale],
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? pageTitle,
      description: pageDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}
