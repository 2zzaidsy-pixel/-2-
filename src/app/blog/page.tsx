import type { Metadata } from "next"
import { BlogContent } from "./BlogContent"
import { getAllArticles, getAllCategories, getFeaturedArticles } from "@/lib/articles"
import { constructMetadata } from "@/lib/metadata"

export const metadata: Metadata = constructMetadata({
  title: "Blog",
  description: "Articles about psychology, sociology, self-development, human behavior, and critical thinking.",
  path: "/blog",
})

export default function BlogPage() {
  const allArticles = getAllArticles()
  const categories = getAllCategories()
  const featuredArticles = getFeaturedArticles()

  return (
    <BlogContent
      allArticles={allArticles}
      categories={categories}
      featuredArticles={featuredArticles}
    />
  )
}
