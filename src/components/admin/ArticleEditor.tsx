"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import { Eye, FileEdit, Loader2, Wand2 } from "lucide-react"
import { Card, Field, PageIntro, TextArea, TextInput } from "@/components/admin/form"
import { SaveBar } from "@/components/admin/SaveBar"
import { readPayload, useUnsavedWarning, type SaveStatus } from "@/components/admin/useResource"
import {
  createArticle,
  updateArticle,
  type ArticleDetail,
} from "@/components/admin/useArticles"
import { articleWriteSchema, type ArticleFrontmatterInput } from "@/lib/admin/schemas"
import { markdownComponents } from "@/lib/markdown"
import { cn } from "@/lib/utils"

type Locale = "en" | "ar"

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function initialFrontmatter(): ArticleFrontmatterInput {
  return {
    title: "",
    date: today(),
    category: "",
    tags: [],
    description: "",
    featured: false,
    published: true,
  }
}

function parseTags(draft: string): string[] {
  return draft
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function serializeSnapshot(
  frontmatter: ArticleFrontmatterInput,
  tagsDraft: string,
  content: string,
  slug: string
): string {
  return JSON.stringify({
    frontmatter: { ...frontmatter, tags: parseTags(tagsDraft) },
    content,
    slug,
  })
}

export function ArticleEditor({
  mode,
  locale,
  slug,
}: {
  mode: "create" | "edit"
  locale: Locale
  slug?: string
}) {
  const router = useRouter()
  const [frontmatter, setFrontmatter] = React.useState(initialFrontmatter)
  const [content, setContent] = React.useState("")
  const [slugValue, setSlugValue] = React.useState(mode === "edit" ? (slug ?? "") : "")
  const [status, setStatus] = React.useState<SaveStatus>(mode === "edit" ? "loading" : "idle")
  const [error, setError] = React.useState<string | null>(null)
  const [tagsDraft, setTagsDraft] = React.useState("")
  const [tab, setTab] = React.useState<"write" | "preview">("write")
  const [baseline, setBaseline] = React.useState<string | null>(() =>
    mode === "create" ? serializeSnapshot(initialFrontmatter(), "", "", "") : null
  )

  const dirty = React.useMemo(
    () => baseline !== null && serializeSnapshot(frontmatter, tagsDraft, content, slugValue) !== baseline,
    [baseline, frontmatter, tagsDraft, content, slugValue]
  )
  useUnsavedWarning(dirty)

  React.useEffect(() => {
    if (mode !== "edit" || !slug) return
    let active = true
    fetch(`/api/admin/articles/${encodeURIComponent(slug)}?locale=${locale}`)
      .then(async (response) => {
        const payload = await readPayload<{ article: ArticleDetail }>(response)
        if (!active) return
        const loaded: ArticleFrontmatterInput = {
          ...payload.article.frontmatter,
          updatedDate: payload.article.frontmatter.updatedDate ?? undefined,
          categoryAr: payload.article.frontmatter.categoryAr ?? undefined,
        }
        const loadedTags = payload.article.frontmatter.tags.join(", ")
        setFrontmatter(loaded)
        setContent(payload.article.content)
        setSlugValue(payload.article.slug)
        setTagsDraft(loadedTags)
        setBaseline(serializeSnapshot(loaded, loadedTags, payload.article.content, payload.article.slug))
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
  }, [mode, slug, locale])

  function patchFrontmatter(next: Partial<ArticleFrontmatterInput>) {
    setFrontmatter((current) => ({ ...current, ...next }))
  }

  async function save() {
    setError(null)
    const candidate: ArticleFrontmatterInput = {
      ...frontmatter,
      tags: parseTags(tagsDraft),
      updatedDate: frontmatter.updatedDate || undefined,
      categoryAr: frontmatter.categoryAr || undefined,
    }

    const parsed = articleWriteSchema.safeParse({
      locale,
      slug: slugValue,
      frontmatter: candidate,
      content,
    })

    if (!parsed.success) {
      setError(
        parsed.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("\n")
      )
      return
    }

    setStatus("saving")
    try {
      if (mode === "create") {
        await createArticle({ locale, slug: slugValue, frontmatter: candidate, content })
        router.replace(`/admin/articles/${encodeURIComponent(slugValue)}?locale=${locale}`)
        router.refresh()
        return
      }

      await updateArticle(slug!, { locale, slug: slugValue, frontmatter: candidate, content })
      if (slugValue !== slug) {
        router.replace(`/admin/articles/${encodeURIComponent(slugValue)}?locale=${locale}`)
        router.refresh()
        return
      }
      setBaseline(serializeSnapshot(frontmatter, tagsDraft, content, slugValue))
      setStatus("saved")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
      setStatus("error")
    }
  }

  if (mode === "edit" && status === "loading") {
    return (
      <Card>
        <span className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          جارٍ تحميل المقال…
        </span>
      </Card>
    )
  }

  return (
    <div>
      <PageIntro
        title={mode === "create" ? "مقال جديد" : "تحرير المقال"}
        description="اكتب المحتوى بصيغة Markdown، وحدّد بيانات النشر. الرابط المختصر للغة الحالية فقط."
      />

      <div className="flex flex-col gap-6">
        <Card title="بيانات المقال">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="العنوان" htmlFor="title" className="sm:col-span-2">
              <TextInput
                id="title"
                value={frontmatter.title}
                onChange={(event) => patchFrontmatter({ title: event.target.value })}
              />
            </Field>

            <Field
              label="الرابط المختصر (slug)"
              htmlFor="slug"
              hint="حروف لاتينية صغيرة وأرقام وشرطات فقط، مثل: why-we-forget"
            >
              <TextInput
                id="slug"
                dir="ltr"
                value={slugValue}
                onChange={(event) => setSlugValue(event.target.value)}
              />
            </Field>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setSlugValue(slugify(frontmatter.title) || slugValue)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Wand2 className="h-4 w-4" />
                توليد من العنوان
              </button>
            </div>

            <Field label="تاريخ النشر" htmlFor="date">
              <TextInput
                id="date"
                type="date"
                dir="ltr"
                value={frontmatter.date}
                onChange={(event) => patchFrontmatter({ date: event.target.value })}
              />
            </Field>

            <Field label="تاريخ التحديث (اختياري)" htmlFor="updatedDate">
              <TextInput
                id="updatedDate"
                type="date"
                dir="ltr"
                value={frontmatter.updatedDate ?? ""}
                onChange={(event) => patchFrontmatter({ updatedDate: event.target.value })}
              />
            </Field>

            <Field label="التصنيف" htmlFor="category">
              <TextInput
                id="category"
                dir="ltr"
                value={frontmatter.category}
                onChange={(event) => patchFrontmatter({ category: event.target.value })}
              />
            </Field>

            <Field label="اسم التصنيف بالعربية (اختياري)" htmlFor="categoryAr">
              <TextInput
                id="categoryAr"
                value={frontmatter.categoryAr ?? ""}
                onChange={(event) => patchFrontmatter({ categoryAr: event.target.value })}
              />
            </Field>

            <Field label="الوسوم (مفصولة بفواصل)" htmlFor="tags" className="sm:col-span-2">
              <TextInput
                id="tags"
                dir="ltr"
                placeholder="psychology, memory, habits"
                value={tagsDraft}
                onChange={(event) => setTagsDraft(event.target.value)}
              />
            </Field>

            <Field
              label="الوصف المختصر (يظهر في القوائم ونتائج البحث)"
              htmlFor="description"
              className="sm:col-span-2"
            >
              <TextArea
                id="description"
                rows={2}
                value={frontmatter.description}
                onChange={(event) => patchFrontmatter({ description: event.target.value })}
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-6">
            <Toggle
              checked={frontmatter.published}
              onChange={(next) => patchFrontmatter({ published: next })}
              label="منشور (ظاهر للزوّار)"
            />
            <Toggle
              checked={frontmatter.featured}
              onChange={(next) => patchFrontmatter({ featured: next })}
              label="مميّز (يظهر في الأعلى)"
            />
          </div>
        </Card>

        <Card
          title="المحتوى"
          description="يدعم Markdown وقوسط الجداول وتمييز الأكواد."
        >
          <div className="mb-3 flex items-center gap-1 rounded-lg border border-border/60 p-1">
            {(
              [
                { id: "write", label: "تحرير", icon: FileEdit },
                { id: "preview", label: "معاينة", icon: Eye },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  tab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          {tab === "write" ? (
            <textarea
              dir="ltr"
              rows={22}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="# ابدأ الكتابة هنا"
              className="w-full resize-y rounded-lg border border-input bg-background p-4 font-mono text-sm leading-relaxed outline-none transition-colors focus-visible:border-primary"
            />
          ) : (
            <div className="prose-custom min-h-[300px] rounded-lg border border-border/60 bg-background p-5">
              {content.trim() ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={markdownComponents}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <p className="text-sm text-muted-foreground">لا يوجد محتوى للمعاينة.</p>
              )}
            </div>
          )}
        </Card>

        <SaveBar
          status={status}
          error={error}
          dirty={dirty}
          saveLabel={
            mode === "create" ? "إنشاء المقال" : "حفظ التعديلات"
          }
          onSave={() => void save()}
          extra={
            mode === "edit" && (
              <a
                href={`/${locale}/blog/${encodeURIComponent(slugValue)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Eye className="h-4 w-4" />
                معاينة على الموقع
              </a>
            )
          }
        />
      </div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[var(--brand-gradient-from)]"
      />
      {label}
    </label>
  )
}
