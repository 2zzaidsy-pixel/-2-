import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArticleContent } from "@/components/blog/ArticleContent"
import {
  getAdjacentArticles,
  getAllArticles,
  getArticleBySlug,
} from "@/lib/articles"
import { constructMetadata } from "@/lib/metadata"
import { createTranslator, isLocale, locales } from "@/lib/i18n"
import "highlight.js/styles/github-dark.css"

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllArticles(locale).map((article) => ({ locale, slug: article.slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}

  const article = getArticleBySlug(slug, locale)
  if (!article) return {}

  return constructMetadata({
    locale,
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    path: `/${locale}/blog/${slug}`,
    type: "article",
    publishedTime: article.frontmatter.date,
    // Article slugs are language-specific, so there is no counterpart URL to
    // advertise. Emitting one would point Google at a 404.
    alternates: null,
  })
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const article = getArticleBySlug(slug, locale)
  if (!article) notFound()

  const { prev, next } = getAdjacentArticles(slug, locale)

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.frontmatter.title,
    description: article.frontmatter.description,
    datePublished: article.frontmatter.date,
    inLanguage: locale,
    author: { "@type": "Person", name: createTranslator(locale)("site.name") },
  }

  return (
    <>
      <ArticleContent article={article} prev={prev} next={next} locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  )
}
