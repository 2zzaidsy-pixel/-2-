import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { Calendar, Clock, ArrowLeft, ArrowRight, List } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  generateTableOfContents,
  markdownComponents,
  rehypeHeadingIds,
  type TocItem,
} from "@/lib/markdown"
import { createTranslator, formatDate, plural, type Locale } from "@/lib/i18n"
import type { Article, ArticleMeta } from "@/lib/articles"

function TocLinks({ items }: { items: TocItem[] }) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="block rounded-md py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          style={{ paddingInlineStart: `${(item.level - 1) * 12 + 8}px` }}
        >
          {item.text}
        </a>
      ))}
    </div>
  )
}

function TableOfContents({ items, label }: { items: TocItem[]; label: string }) {
  if (items.length === 0) return null

  return (
    <nav aria-label={label} className="glass-card sticky top-28 hidden rounded-xl p-5 lg:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <TocLinks items={items} />
    </nav>
  )
}

function MobileTableOfContents({ items, label }: { items: TocItem[]; label: string }) {
  if (items.length === 0) return null

  return (
    <details className="glass-card mb-10 rounded-xl p-5 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <List aria-hidden className="h-4 w-4" />
        {label}
      </summary>
      <div className="mt-3">
        <TocLinks items={items} />
      </div>
    </details>
  )
}

export function ArticleContent({
  article,
  prev,
  next,
  locale,
}: {
  article: Article
  prev: ArticleMeta | null
  next: ArticleMeta | null
  locale: Locale
}) {
  const t = createTranslator(locale)
  const toc = generateTableOfContents(article.content)
  const category =
    locale === "ar" && article.frontmatter.categoryAr
      ? article.frontmatter.categoryAr
      : article.frontmatter.category

  return (
    <div className="pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link href={`/${locale}/blog`}>
            <ArrowLeft aria-hidden className="me-2 h-4 w-4 rtl:scale-x-[-1]" />
            {t("blog.backToBlog")}
          </Link>
        </Button>

        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar aria-hidden className="h-3.5 w-3.5" />
            {formatDate(article.frontmatter.date, locale)}
          </span>
          <span className="flex items-center gap-1">
            <Clock aria-hidden className="h-3.5 w-3.5" />
            {plural("blog.readingTime", article.readingMinutes, locale)}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{category}</Badge>
          <span className="text-xs text-muted-foreground">
            {t("blog.byline")} {t("site.name")}
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {article.frontmatter.title}
        </h1>

        <p className="mb-6 text-base leading-relaxed text-muted-foreground">
          {article.frontmatter.description}
        </p>

        <div className="mb-10 flex flex-wrap gap-2">
          {article.frontmatter.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_200px]">
          <div className="min-w-0">
            <MobileTableOfContents items={toc} label={t("blog.onThisPage")} />

            <article className="prose-custom max-w-[70ch]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHeadingIds, rehypeHighlight]}
                components={markdownComponents}
              >
                {article.content}
              </ReactMarkdown>
            </article>

            <div className="mt-14 flex flex-col gap-6 border-t border-border/50 pt-8 sm:flex-row sm:items-center sm:justify-between">
              {prev ? (
                <Link
                  href={`/${locale}/blog/${prev.slug}`}
                  className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft
                    aria-hidden
                    className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:scale-x-[-1]"
                  />
                  <span>
                    <span className="block text-xs text-muted-foreground">
                      {t("blog.previous")}
                    </span>
                    <span className="line-clamp-1 font-medium">{prev.frontmatter.title}</span>
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {next && (
                <Link
                  href={`/${locale}/blog/${next.slug}`}
                  className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:text-end"
                >
                  <span>
                    <span className="block text-xs text-muted-foreground">{t("blog.next")}</span>
                    <span className="line-clamp-1 font-medium">{next.frontmatter.title}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:scale-x-[-1]"
                  />
                </Link>
              )}
            </div>
          </div>

          <aside className="hidden lg:block">
            <TableOfContents items={toc} label={t("blog.onThisPage")} />
          </aside>
        </div>
      </div>
    </div>
  )
}
