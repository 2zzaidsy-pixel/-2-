import matter from "gray-matter"
import readingTime from "reading-time"
import { deleteFile, listDirectory, readFile, writeFile } from "@/lib/admin/github"
import type { ArticleFrontmatterInput } from "@/lib/admin/schemas"
import type { Locale } from "@/lib/i18n"
import { isValidSlug, type ArticleFrontmatter } from "@/lib/articles"

const articlesRoot = "src/content/articles"

function articlePath(locale: Locale, slug: string): string {
  return `${articlesRoot}/${locale}/${slug}.md`
}

function asDate(value: unknown, fallback: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value === "string" && value) return value.slice(0, 10)
  return fallback
}

function normalize(raw: Record<string, unknown>): ArticleFrontmatter {
  const tags = Array.isArray(raw.tags) ? raw.tags.map(String) : []
  return {
    title: typeof raw.title === "string" ? raw.title : "Untitled",
    date: asDate(raw.date, "1970-01-01"),
    updatedDate:
      typeof raw.updatedDate === "string" && raw.updatedDate
        ? raw.updatedDate
        : asDateIsolated(raw.updatedDate),
    category: typeof raw.category === "string" ? raw.category : "General",
    categoryAr: typeof raw.categoryAr === "string" && raw.categoryAr ? raw.categoryAr : undefined,
    tags,
    description: typeof raw.description === "string" ? raw.description : "",
    featured: raw.featured === true,
    published: raw.published !== false,
  }
}

function asDateIsolated(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10)
  return undefined
}

export interface AdminArticle {
  slug: string
  frontmatter: ArticleFrontmatter
  readingMinutes: number
}

export interface AdminArticleDetail extends AdminArticle {
  content: string
}

function serialize(frontmatter: ArticleFrontmatterInput, content: string): string {
  const data: Record<string, unknown> = {
    title: frontmatter.title,
    date: frontmatter.date,
    category: frontmatter.category,
    tags: frontmatter.tags,
    description: frontmatter.description,
    featured: frontmatter.featured,
    published: frontmatter.published,
  }
  if (frontmatter.updatedDate) data.updatedDate = frontmatter.updatedDate
  if (frontmatter.categoryAr) data.categoryAr = frontmatter.categoryAr
  return matter.stringify(content, data)
}

export async function listArticles(locale: Locale): Promise<AdminArticle[]> {
  const entries = await listDirectory(`${articlesRoot}/${locale}`)
  const markdown = entries.filter((entry) => entry.name.endsWith(".md"))

  const articles = await Promise.all(
    markdown.map(async (entry) => {
      const file = await readFile(entry.path)
      if (!file) return null
      const slug = entry.name.slice(0, -3)
      if (!isValidSlug(slug)) return null
      const parsed = matter(file.content)
      return {
        slug,
        frontmatter: normalize(parsed.data as Record<string, unknown>),
        readingMinutes: Math.max(1, Math.round(readingTime(parsed.content).minutes)),
      }
    })
  )

  return articles
    .filter((article): article is AdminArticle => article !== null)
    .sort(
      (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
}

export async function getArticle(
  locale: Locale,
  slug: string
): Promise<AdminArticleDetail | null> {
  if (!isValidSlug(slug)) return null
  const file = await readFile(articlePath(locale, slug))
  if (!file) return null
  const parsed = matter(file.content)
  return {
    slug,
    frontmatter: normalize(parsed.data as Record<string, unknown>),
    content: parsed.content,
    readingMinutes: Math.max(1, Math.round(readingTime(parsed.content).minutes)),
  }
}

export async function createArticle(input: {
  locale: Locale
  slug: string
  frontmatter: ArticleFrontmatterInput
  content: string
}): Promise<void> {
  const { locale, slug, frontmatter, content } = input
  const path = articlePath(locale, slug)
  const existing = await readFile(path)
  if (existing) throw new Error(`يوجد مقال بالرابط المختصر هذا بالفعل: ${slug}`)
  await writeFile(path, serialize(frontmatter, content), `content(${locale}): create ${slug}`)
}

export async function updateArticle(input: {
  locale: Locale
  slug: string
  renameFrom?: string
  frontmatter: ArticleFrontmatterInput
  content: string
}): Promise<void> {
  const { locale, slug, renameFrom, frontmatter, content } = input
  const sourceSlug = renameFrom ?? slug
  const sourcePath = articlePath(locale, sourceSlug)
  const existing = await readFile(sourcePath)
  if (!existing) throw new Error(`لم يتم العثور على المقال: ${sourceSlug}`)

  const serialized = serialize(frontmatter, content)

  if (slug === sourceSlug) {
    await writeFile(
      sourcePath,
      serialized,
      `content(${locale}): update ${slug}`,
      existing.sha
    )
    return
  }

  const targetPath = articlePath(locale, slug)
  if (await readFile(targetPath)) throw new Error(`الرابط المختصر مستخدم بالفعل: ${slug}`)
  await writeFile(targetPath, serialized, `content(${locale}): rename ${sourceSlug} to ${slug}`)
  await deleteFile(sourcePath, `content(${locale}): remove ${sourceSlug}`, existing.sha)
}

export async function deleteArticle(input: { locale: Locale; slug: string }): Promise<void> {
  const { locale, slug } = input
  const path = articlePath(locale, slug)
  const file = await readFile(path)
  if (!file) throw new Error(`لم يتم العثور على المقال: ${slug}`)
  await deleteFile(path, `content(${locale}): delete ${slug}`, file.sha)
}
