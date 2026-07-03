import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"

export interface ArticleFrontmatter {
  title: string
  date: string
  category: string
  tags: string[]
  description: string
  featured: boolean
  featuredImage?: string
  published: boolean
}

export interface ArticleMeta {
  slug: string
  frontmatter: ArticleFrontmatter
  readingTime: string
}

export interface Article extends ArticleMeta {
  content: string
}

const articlesDir = path.join(process.cwd(), "src", "content", "articles")

function formatReadingTime(text: string): string {
  const stats = readingTime(text)
  return stats.text
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(articlesDir)) return []

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"))

  const articles = files.map((file) => {
    const slug = file.replace(/\.md$/, "")
    const raw = fs.readFileSync(path.join(articlesDir, file), "utf-8")
    const { data, content } = matter(raw)
    const frontmatter = data as ArticleFrontmatter

    return {
      slug,
      frontmatter,
      readingTime: formatReadingTime(content),
    }
  })

  return articles
    .filter((a) => a.frontmatter.published !== false)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(articlesDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)
  const frontmatter = data as ArticleFrontmatter

  return {
    slug,
    frontmatter,
    content,
    readingTime: formatReadingTime(content),
  }
}

export function getAllCategories(): string[] {
  const articles = getAllArticles()
  const categories = new Set(articles.map((a) => a.frontmatter.category))
  return Array.from(categories).sort()
}

export function getAllTags(): string[] {
  const articles = getAllArticles()
  const tags = new Set(articles.flatMap((a) => a.frontmatter.tags))
  return Array.from(tags).sort()
}

export function getFeaturedArticles(): ArticleMeta[] {
  return getAllArticles().filter((a) => a.frontmatter.featured)
}

export function getAdjacentArticles(slug: string): { prev: ArticleMeta | null; next: ArticleMeta | null } {
  const all = getAllArticles()
  const idx = all.findIndex((a) => a.slug === slug)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}

export function searchArticles(query: string): ArticleMeta[] {
  const q = query.toLowerCase()
  return getAllArticles().filter(
    (a) =>
      a.frontmatter.title.toLowerCase().includes(q) ||
      a.frontmatter.description.toLowerCase().includes(q) ||
      a.frontmatter.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.frontmatter.category.toLowerCase().includes(q)
  )
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.frontmatter.category === category)
}

export function getArticlesByTag(tag: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.frontmatter.tags.includes(tag))
}
