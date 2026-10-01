"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/blog/SearchBar"
import { CategoryFilter } from "@/components/blog/CategoryFilter"
import { createTranslator, plural, type Locale } from "@/lib/i18n"
import type { ArticleMeta } from "@/lib/articles"

export function BlogContent({
  allArticles,
  categories,
  locale,
  featuredSection,
  cards,
}: {
  allArticles: ArticleMeta[]
  categories: string[]
  locale: Locale
  featuredSection: React.ReactNode
  cards: Record<string, React.ReactNode>
}) {
  const t = React.useMemo(() => createTranslator(locale), [locale])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)

  const hasFeatured = allArticles.some((article) => article.frontmatter.featured)
  const query = searchQuery.trim().toLowerCase()
  const isFiltering = query.length > 0 || selectedCategory !== null

  const categoryLabel = React.useCallback(
    (value: string) =>
      locale === "ar"
        ? (allArticles.find((a) => a.frontmatter.category === value)?.frontmatter.categoryAr ??
          value)
        : value,
    [allArticles, locale]
  )

  const categoryOptions = React.useMemo(
    () => categories.map((value) => ({ value, label: categoryLabel(value) })),
    [categories, categoryLabel]
  )

  const visibleArticles = React.useMemo(() => {
    // While filtering, featured articles stay in the pool so a search never
    // hides a match just because it was promoted to the top section.
    const source =
      isFiltering || !hasFeatured
        ? allArticles
        : allArticles.filter((article) => !article.frontmatter.featured)

    if (selectedCategory) {
      return source.filter((article) => article.frontmatter.category === selectedCategory)
    }

    if (!query) return source

    return source.filter((article) => {
      const { title, description, category, categoryAr, tags } = article.frontmatter
      return (
        title.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        (categoryAr?.toLowerCase().includes(query) ?? false) ||
        tags.some((tag) => tag.toLowerCase().includes(query))
      )
    })
  }, [allArticles, hasFeatured, isFiltering, query, selectedCategory])

  return (
    <div className="pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="max-width px-6 sm:px-8 lg:px-16">
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link href={`/${locale}`}>
            <ArrowLeft aria-hidden className="me-2 h-4 w-4 rtl:scale-x-[-1]" />
            {t("error.home")}
          </Link>
        </Button>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          {t("blog.heading")}
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {t("blog.heading")}
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          {t("blog.subtitle")}
        </p>

        {allArticles.length > 0 ? (
          <>
            {hasFeatured && !isFiltering && <div className="mt-16">{featuredSection}</div>}

            <div className="mt-10 space-y-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={t("blog.search")}
                label={t("blog.searchLabel")}
                clearLabel={t("blog.clearSearch")}
              />
              <CategoryFilter
                categories={categoryOptions}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                allLabel={t("blog.all")}
                groupLabel={t("blog.allCategories")}
              />
            </div>

            <p aria-live="polite" className="mt-6 text-xs text-muted-foreground">
              {plural("blog.resultsCount", visibleArticles.length, locale)}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleArticles.map((article) => (
                <React.Fragment key={article.slug}>{cards[article.slug]}</React.Fragment>
              ))}
            </div>

            {visibleArticles.length === 0 && (
              <p className="py-20 text-center text-muted-foreground">{t("blog.noResults")}</p>
            )}
          </>
        ) : (
          <p className="py-20 text-center text-muted-foreground">{t("blog.empty")}</p>
        )}
      </div>
    </div>
  )
}
