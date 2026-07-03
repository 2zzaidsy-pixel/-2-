"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/blog/ArticleCard"
import { SearchBar } from "@/components/blog/SearchBar"
import { CategoryFilter } from "@/components/blog/CategoryFilter"
import { FeaturedArticles } from "@/components/blog/FeaturedArticles"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation } from "@/lib/i18n"
import type { ArticleMeta } from "@/lib/articles"

interface BlogContentProps {
  allArticles: ArticleMeta[]
  categories: string[]
  featuredArticles: ArticleMeta[]
}

export function BlogContent({ allArticles, categories, featuredArticles }: BlogContentProps) {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)

  const filteredArticles = React.useMemo(() => {
    let articles = allArticles

    if (selectedCategory) {
      articles = articles.filter((a) => a.frontmatter.category === selectedCategory)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      articles = articles.filter(
        (a) =>
          a.frontmatter.title.toLowerCase().includes(q) ||
          a.frontmatter.description.toLowerCase().includes(q) ||
          a.frontmatter.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.frontmatter.category.toLowerCase().includes(q)
      )
    }

    return articles
  }, [allArticles, selectedCategory, searchQuery])

  return (
    <main>
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-20">
        <div className="max-width px-6 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button asChild variant="ghost" size="sm" className="mb-8">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("projects.backHome")}
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 text-xs font-medium text-muted-foreground mb-6">
              Blog
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("blog.heading")}
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl leading-relaxed">
              {t("blog.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {allArticles.length > 0 && (
        <>
          {featuredArticles.length > 0 && !searchQuery && !selectedCategory && (
            <section className="pb-8">
              <div className="max-width px-6 sm:px-8 lg:px-16">
                <FeaturedArticles articles={featuredArticles} />
              </div>
            </section>
          )}

          <section className="pb-24 sm:pb-32">
            <div className="max-width px-6 sm:px-8 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6 mb-10"
              >
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={t("blog.search")}
                />
                <CategoryFilter
                  categories={categories}
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                  allLabel={t("blog.all")}
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredArticles.map((article, index) => (
                  <ArticleCard key={article.slug} article={article} index={index} />
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">{t("blog.noResults")}</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {allArticles.length === 0 && (
        <section className="pb-32">
          <div className="max-width px-6 sm:px-8 lg:px-16 text-center py-20">
            <p className="text-muted-foreground">{t("blog.empty")}</p>
          </div>
        </section>
      )}
    </main>
  )
}
