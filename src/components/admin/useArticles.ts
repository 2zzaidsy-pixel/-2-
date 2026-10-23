"use client"

import * as React from "react"
import { readPayload, type SaveStatus } from "@/components/admin/useResource"
import type { ArticleFrontmatterInput } from "@/lib/admin/schemas"

export interface ArticleListItem {
  slug: string
  frontmatter: ArticleFrontmatterInput
  readingMinutes: number
}

export interface ArticleDetail {
  slug: string
  frontmatter: ArticleFrontmatterInput
  content: string
  readingMinutes: number
}

export interface ArticleWritePayload {
  locale: string
  slug: string
  frontmatter: ArticleFrontmatterInput
  content: string
}

function toWritePayload(
  locale: string,
  detail: ArticleDetail,
  slug: string
): ArticleWritePayload {
  return {
    locale,
    slug,
    frontmatter: detail.frontmatter,
    content: detail.content,
  }
}

export function useArticleList(locale: string) {
  const [articles, setArticles] = React.useState<ArticleListItem[] | null>(null)
  const [status, setStatus] = React.useState<SaveStatus>("loading")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let active = true
    fetch(`/api/admin/articles?locale=${locale}`)
      .then(async (response) => {
        const payload = await readPayload<{ articles: ArticleListItem[] }>(response)
        if (!active) return
        setArticles(payload.articles)
        setStatus("idle")
      })
      .catch((caught: unknown) => {
        if (!active) return
        setError(caught instanceof Error ? caught.message : String(caught))
        setStatus("error")
      })
    return () => {
      active = false
    }
  }, [locale])

  const remove = React.useCallback(
    async (slug: string): Promise<boolean> => {
      setStatus("saving")
      setError(null)
      try {
        await readPayload(
          await fetch(
            `/api/admin/articles/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
            { method: "DELETE" }
          )
        )
        setArticles((previous) => (previous ? previous.filter((item) => item.slug !== slug) : previous))
        setStatus("idle")
        return true
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : String(caught))
        setStatus("error")
        return false
      }
    },
    [locale]
  )

  return { articles, status, error, remove }
}

export async function createArticle(payload: ArticleWritePayload): Promise<string> {
  await readPayload(
    await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  )
  return payload.slug
}

export async function updateArticle(
  currentSlug: string,
  payload: ArticleWritePayload
): Promise<string> {
  await readPayload(
    await fetch(`/api/admin/articles/${encodeURIComponent(currentSlug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  )
  return payload.slug
}

export { toWritePayload }
