"use client"

import * as React from "react"
import Link from "next/link"
import { siteConfig } from "@/data/site"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation } from "@/lib/i18n"

const exploreKeys = [
  { href: "/", key: "nav.home" },
  { href: "/#about", key: "nav.about" },
  { href: "/#fields", key: "nav.fields" },
  { href: "/#philosophy", key: "nav.philosophy" },
  { href: "/projects", key: "nav.projects" },
]

export function Footer() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)

  return (
    <footer className="border-t border-border/50">
      <div className="max-width px-6 sm:px-8 lg:px-16 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight"
            >
              {t("site.title")}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm leading-relaxed">
              {t("site.description")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">{t("footer.explore")}</h3>
            <ul className="space-y-3">
              {exploreKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">{t("footer.connect")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.email")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. {t("footer.rights")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("footer.built")}
          </p>
        </div>
      </div>
    </footer>
  )
}
