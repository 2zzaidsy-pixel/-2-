"use client"

import * as React from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { markdownComponents, generateTableOfContents } from "@/lib/markdown"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation } from "@/lib/i18n"
import type { Article } from "@/lib/articles"
import type { ArticleMeta } from "@/lib/articles"

function TableOfContents({ items }: { items: { id: string; text: string; level: number }[] }) {
  if (items.length === 0) return null

  return (
    <div className="glass-card rounded-xl p-5 sticky top-28">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        On this page
      </h4>
      <nav className="space-y-1.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  )
}

export function ArticleContent({
  article,
  prev,
  next,
}: {
  article: Article
  prev: ArticleMeta | null
  next: ArticleMeta | null
}) {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)

  const toc = React.useMemo(() => generateTableOfContents(article.content), [article.content])

  return (
    <main>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-32 sm:pt-40 pb-16">
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("projects.backHome")}
            </Link>
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(article.frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.readingTime}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{article.frontmatter.category}</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {article.frontmatter.title}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            {article.frontmatter.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {article.frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-24 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-10">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose-custom min-w-0"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeSlug]}
              components={markdownComponents}
            >
              {article.content}
            </ReactMarkdown>

            <Separator className="my-12" />

            <div className="flex items-center justify-between gap-4">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Previous</div>
                    <div className="font-medium line-clamp-1">{prev.frontmatter.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"
                >
                  <div>
                    <div className="text-xs text-muted-foreground">Next</div>
                    <div className="font-medium line-clamp-1">{next.frontmatter.title}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </motion.article>

          <aside className="hidden lg:block">
            <TableOfContents items={toc} />
          </aside>
        </div>
      </div>
    </main>
  )
}
