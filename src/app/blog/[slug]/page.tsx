import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArticleContent } from "@/components/blog/ArticleContent"
import { getArticleBySlug, getAllArticles, getAdjacentArticles } from "@/lib/articles"
import { constructMetadata } from "@/lib/metadata"
import "highlight.js/styles/github-dark.css"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return constructMetadata({ title: "Not Found" })

  return constructMetadata({
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    path: `/blog/${slug}`,
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const { prev, next } = getAdjacentArticles(slug)

  return <ArticleContent article={article} prev={prev} next={next} />
}
