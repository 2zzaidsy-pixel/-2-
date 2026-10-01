"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createTranslator, defaultLocale, isLocale } from "@/lib/i18n"

export default function LocaleNotFound() {
  const pathname = usePathname()
  const first = pathname.split("/").filter(Boolean)[0]
  const locale = isLocale(first) ? first : defaultLocale
  const t = createTranslator(locale)

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-gradient text-6xl font-bold">404</p>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t("error.notFoundTitle")}
      </h1>
      <p className="max-w-md leading-relaxed text-muted-foreground">
        {t("error.notFoundBody")}
      </p>
      <Link
        href={`/${locale}`}
        className="inline-flex h-11 items-center rounded-lg bg-gradient-to-r from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] px-6 text-sm font-medium text-white"
      >
        {t("error.home")}
      </Link>
    </div>
  )
}
