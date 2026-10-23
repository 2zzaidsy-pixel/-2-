import { ArticlesList } from "@/components/admin/ArticlesList"
import { localeFromSearchParams } from "@/lib/admin/search"

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const locale = localeFromSearchParams((await searchParams).locale)
  return <ArticlesList key={locale} locale={locale} />
}
