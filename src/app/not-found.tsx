import Link from "next/link"
import type { Metadata } from "next"
import { locales } from "@/lib/i18n"
import { constructMetadata } from "@/lib/metadata"
import { getMessages } from "@/lib/i18n"

export const metadata: Metadata = constructMetadata({ locale: "en" })

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-gradient text-6xl font-bold">404</p>
      {locales.map((locale) => {
        const t = getMessages(locale)
        return (
          <div key={locale} className={locale === "en" ? "block" : "hidden"}>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t["error.notFoundTitle"]}
            </h1>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
              {t["error.notFoundBody"]}
            </p>
            <Link
              href={`/${locale}`}
              className="mt-8 inline-flex h-11 items-center rounded-lg bg-gradient-to-r from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] px-6 text-sm font-medium text-white"
            >
              {t["error.home"]}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
