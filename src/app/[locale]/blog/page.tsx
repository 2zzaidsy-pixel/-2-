import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { BlogContent } from "@/components/blog/BlogContent"
import { ArticleCard } from "@/components/blog/ArticleCard"
import { FeaturedArticles } from "@/components/blog/FeaturedArticles"
import { getAllArticles, getAllCategories, getFeaturedArticles } from "@/lib/articles"
import { constructMetadata } from "@/lib/metadata"
import { createTranslator, isLocale } from "@/lib/i18n"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const t = createTranslator(locale)
  return constructMetadata({
    locale,
    title: t("blog.heading"),
    description: t("blog.subtitle"),
    path: `/${locale}/blog`,
  })
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const allArticles = getAllArticles(locale)
  const featuredArticles = getFeaturedArticles(locale)

  return (
    <BlogContent
      allArticles={allArticles}
      categories={getAllCategories(locale)}
      locale={locale}
      featuredSection={<FeaturedArticles articles={featuredArticles} locale={locale} />}
      cards={Object.fromEntries(
        allArticles.map((article) => [
          article.slug,
          <ArticleCard key={article.slug} article={article} locale={locale} />,
        ])
      )}
    />
  )
}
