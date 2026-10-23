import { ArticleEditor } from "@/components/admin/ArticleEditor"
import { localeFromSearchParams } from "@/lib/admin/search"

export default async function AdminNewArticlePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const locale = localeFromSearchParams((await searchParams).locale)
  return <ArticleEditor mode="create" locale={locale} />
}
