import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"
import { locales, type Locale } from "@/lib/i18n"

export interface ArticleFrontmatter {
  title: string
  date: string
  updatedDate?: string
  category: string
  categoryAr?: string
  tags: string[]
  description: string
  featured: boolean
  published: boolean
}

export interface ArticleMeta {
  slug: string
  locale: Locale
  frontmatter: ArticleFrontmatter
  readingMinutes: number
}

export interface Article extends ArticleMeta {
  content: string
}

const articlesRoot = path.join(process.cwd(), "src", "content", "articles")

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug)
}

function normalizeFrontmatter(data: Record<string, unknown>): ArticleFrontmatter {
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : []
  return {
    title: typeof data.title === "string" ? data.title : "Untitled",
    date: typeof data.date === "string" ? data.date : "1970-01-01",
    updatedDate: typeof data.updatedDate === "string" ? data.updatedDate : undefined,
    category: typeof data.category === "string" ? data.category : "General",
    categoryAr: typeof data.categoryAr === "string" ? data.categoryAr : undefined,
    tags,
    description: typeof data.description === "string" ? data.description : "",
    featured: data.featured === true,
    published: data.published !== false,
  }
}

function readArticleFile(filePath: string, locale: Locale): Article {
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)
  return {
    slug: path.basename(filePath, ".md"),
    locale,
    frontmatter: normalizeFrontmatter(data as Record<string, unknown>),
    content,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  }
}

function articlesDir(locale: Locale): string {
  return path.join(articlesRoot, locale)
}

export function getAllArticles(locale: Locale): ArticleMeta[] {
  const dir = articlesDir(locale)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readArticleFile(path.join(dir, file), locale))
    .filter((article) => article.frontmatter.published)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
}

export function getArticleBySlug(slug: string, locale: Locale): Article | null {
  if (!isValidSlug(slug)) return null

  const filePath = path.join(articlesDir(locale), `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  return readArticleFile(filePath, locale)
}

export function getAllCategories(locale: Locale): string[] {
  const categories = new Set(
    getAllArticles(locale).map((article) => article.frontmatter.category)
  )
  return Array.from(categories).sort()
}

export function getFeaturedArticles(locale: Locale): ArticleMeta[] {
  return getAllArticles(locale).filter((article) => article.frontmatter.featured)
}

export function getAdjacentArticles(
  slug: string,
  locale: Locale
): { prev: ArticleMeta | null; next: ArticleMeta | null } {
  const all = getAllArticles(locale)
  const index = all.findIndex((article) => article.slug === slug)
  if (index === -1) return { prev: null, next: null }

  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  }
}

export function getArticleCount(locale: Locale): number {
  return locales.includes(locale) ? getAllArticles(locale).length : 0
}
