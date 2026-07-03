"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ArticleMeta } from "@/lib/articles"

export function FeaturedArticles({ articles }: { articles: ArticleMeta[] }) {
  if (articles.length === 0) return null

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight">Featured Articles</h2>
        <Link
          href="/blog"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article, index) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={`/blog/${article.slug}`} className="group block h-full">
              <article className="glass-card rounded-xl p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(article.frontmatter.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readingTime}
                  </span>
                </div>
                <Badge variant="secondary" className="text-[10px] w-fit mb-2">
                  {article.frontmatter.category}
                </Badge>
                <h3 className="text-base font-semibold tracking-tight mb-2 group-hover:text-primary transition-colors">
                  {article.frontmatter.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                  {article.frontmatter.description}
                </p>
                <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Read <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
