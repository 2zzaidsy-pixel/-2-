import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createTranslator, formatDate, plural, type Locale } from "@/lib/i18n"
import type { ArticleMeta } from "@/lib/articles"

export function FeaturedArticles({
  articles,
  locale,
}: {
  articles: ArticleMeta[]
  locale: Locale
}) {
  if (articles.length === 0) return null
  const t = createTranslator(locale)

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-xl font-bold tracking-tight">{t("blog.featuredHeading")}</h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const category =
            locale === "ar" && article.frontmatter.categoryAr
              ? article.frontmatter.categoryAr
              : article.frontmatter.category

          return (
            <Link
              key={article.slug}
              href={`/${locale}/blog/${article.slug}`}
              className="glass-card group flex h-full flex-col rounded-xl p-6"
            >
              <article className="flex h-full flex-col">
                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar aria-hidden className="h-3 w-3" />
                    {formatDate(article.frontmatter.date, locale)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock aria-hidden className="h-3 w-3" />
                    {plural("blog.readingTime", article.readingMinutes, locale)}
                  </span>
                </div>

                <Badge variant="secondary" className="mb-3 w-fit">
                  {category}
                </Badge>

                <h3 className="mb-2 text-base font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {article.frontmatter.title}
                </h3>

                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {article.frontmatter.description}
                </p>

                <span className="mt-4 inline-flex items-center text-xs font-medium text-primary">
                  {t("blog.readArticle")}
                  <ArrowRight
                    aria-hidden
                    className="ms-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 rtl:scale-x-[-1]"
                  />
                </span>
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
