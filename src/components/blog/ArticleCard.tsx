"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ArticleMeta } from "@/lib/articles"

export function ArticleCard({ article, index }: { article: ArticleMeta; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/blog/${article.slug}`} className="group block">
        <article className="glass-card rounded-xl p-6 sm:p-8 h-full">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
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

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-[10px]">
              {article.frontmatter.category}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold tracking-tight mb-2 group-hover:text-primary transition-colors">
            {article.frontmatter.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {article.frontmatter.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.frontmatter.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
            {article.frontmatter.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{article.frontmatter.tags.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Read Article
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
