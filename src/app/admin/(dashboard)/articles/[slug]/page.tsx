import { ArticleEditor } from "@/components/admin/ArticleEditor"
import { localeFromSearchParams } from "@/lib/admin/search"

export default async function AdminEditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const locale = localeFromSearchParams((await searchParams).locale)
  return <ArticleEditor mode="edit" locale={locale} slug={decodeURIComponent(slug)} />
}
