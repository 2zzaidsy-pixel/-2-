"use client"

import * as React from "react"
import Link from "next/link"
import { FilePlus2, Loader2, Pencil, Trash2 } from "lucide-react"
import { Card, PageIntro } from "@/components/admin/form"
import { useArticleList } from "@/components/admin/useArticles"

export function ArticlesList({ locale }: { locale: "en" | "ar" }) {
  const { articles, status, error, remove } = useArticleList(locale)
  const [deleting, setDeleting] = React.useState<string | null>(null)
  const [actionError, setActionError] = React.useState<string | null>(null)

  async function onDelete(slug: string) {
    if (!window.confirm(`حذف المقال «${slug}» نهائيًا؟ هذا لا يمكن التراجع عنه.`)) return
    setDeleting(slug)
    setActionError(null)
    const ok = await remove(slug)
    if (!ok) setActionError("تعذّر الحذف.")
    setDeleting(null)
  }

  const otherLocale = locale === "ar" ? "en" : "ar"

  return (
    <div>
      <PageIntro
        title="المقالات"
        description="اكتب مقالات جديدة، عدّلها، وانشرها أو أخفها. كل مقال بلغة واحدة."
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border/60 p-1">
          {(["ar", "en"] as const).map((item) => (
            <Link
              key={item}
              href={`/admin/articles?locale=${item}`}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                item === locale
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item === "ar" ? "العربية" : "English"}
            </Link>
          ))}
        </div>

        <Link
          href={`/admin/articles/new?locale=${locale}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <FilePlus2 className="h-4 w-4" />
          مقال جديد
        </Link>
      </div>

      {actionError && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          {actionError}
        </p>
      )}

      {articles === null ? (
        <Card>
          <span className="flex items-center gap-2 text-muted-foreground">
            {status === "error" ? null : <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "error" ? error : "جارٍ التحميل…"}
          </span>
        </Card>
      ) : articles.length === 0 ? (
        <Card>لا توجد مقالات في هذه اللغة بعد.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="rounded-xl border border-border/60 bg-card p-4 sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold">{article.frontmatter.title}</h2>
                    <Badge active={article.frontmatter.published} label="منشور" />
                    <Badge active={article.frontmatter.featured} label="مميّز" />
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <code dir="ltr">{article.slug}</code>
                    <span>{article.frontmatter.date}</span>
                    <span>{article.frontmatter.category}</span>
                    <span>{article.readingMinutes} دقائق قراءة</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/articles/${encodeURIComponent(article.slug)}?locale=${locale}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary/40"
                  >
                    <Pencil className="h-4 w-4" />
                    تحرير
                  </Link>
                  <button
                    type="button"
                    onClick={() => void onDelete(article.slug)}
                    disabled={deleting === article.slug}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                  >
                    {deleting === article.slug ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    حذف
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        اللغة الحالية: {locale === "ar" ? "العربية" : "English"} —{" "}
        <Link
          href={`/admin/articles?locale=${otherLocale}`}
          className="underline underline-offset-2 hover:text-foreground"
        >
          تبديل اللغة
        </Link>
      </p>
    </div>
  )
}

function Badge({ active, label }: { active: boolean; label: string }) {
  if (!active) return null
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
      {label}
    </span>
  )
}
