import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createTranslator, formatDate, plural, type Locale } from "@/lib/i18n"
import type { ArticleMeta } from "@/lib/articles"

export function ArticleCard({
  article,
  locale,
}: {
  article: ArticleMeta
  locale: Locale
}) {
  const t = createTranslator(locale)
  const category =
    locale === "ar" && article.frontmatter.categoryAr
      ? article.frontmatter.categoryAr
      : article.frontmatter.category

  return (
    <Link
      href={`/${locale}/blog/${article.slug}`}
      className="glass-card group block h-full rounded-xl p-6 sm:p-8"
    >
      <article className="flex h-full flex-col">
        <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar aria-hidden className="h-3.5 w-3.5" />
            {formatDate(article.frontmatter.date, locale)}
          </span>
          <span className="flex items-center gap-1">
            <Clock aria-hidden className="h-3.5 w-3.5" />
            {plural("blog.readingTime", article.readingMinutes, locale)}
          </span>
        </div>

        <Badge variant="secondary" className="mb-3 w-fit">
          {category}
        </Badge>

        <h3 className="mb-2 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
          {article.frontmatter.title}
        </h3>

        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {article.frontmatter.description}
        </p>

        <span className="mt-auto inline-flex items-center text-xs font-medium text-primary">
          {t("blog.readArticle")}
          <ArrowRight
            aria-hidden
            className="ms-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 rtl:scale-x-[-1]"
          />
        </span>
      </article>
    </Link>
  )
}
