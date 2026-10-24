"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { createTranslator, defaultLocale, isLocale } from "@/lib/i18n"

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams<{ locale?: string }>()
  const locale = isLocale(params?.locale) ? params.locale : defaultLocale
  const t = React.useMemo(() => createTranslator(locale), [locale])

  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("error.title")}</h1>
      <p className="max-w-md leading-relaxed text-muted-foreground">{t("error.body")}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="h-11 rounded-lg bg-gradient-to-r from-primary/20 via-accent/25 to-primary/15 border border-primary/30 text-black font-semibold dark:border-transparent dark:from-[var(--brand-gradient-from)] dark:to-[var(--brand-gradient-to)] dark:text-white px-6 text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("error.retry")}
        </button>
        <Link
          href={`/${locale}`}
          className="inline-flex h-11 items-center rounded-lg border border-border px-6 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("error.home")}
        </Link>
      </div>
    </div>
  )
}
