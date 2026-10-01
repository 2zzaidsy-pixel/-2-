"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Menu, X, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  createTranslator,
  languageSwitchHref,
  localeLabel,
  type Locale,
} from "@/lib/i18n"

const navSections = [
  { id: "about", key: "nav.about" },
  { id: "fields", key: "nav.fields" },
  { id: "philosophy", key: "nav.philosophy" },
] as const

export function Header({ locale }: { locale: Locale }) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const t = React.useMemo(() => createTranslator(locale), [locale])

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const home = `/${locale}`
  const navItems = React.useMemo(
    () => [
      { href: home, key: "nav.home" as const, match: home },
      ...navSections.map((section) => ({
        href: `${home}/#${section.id}`,
        key: section.key,
        match: `${home}/#${section.id}`,
      })),
      { href: `${home}/blog`, key: "nav.blog" as const, match: `${home}/blog` },
      { href: `${home}/projects`, key: "nav.projects" as const, match: `${home}/projects` },
      { href: `${home}/#contact`, key: "nav.contact" as const, match: `${home}/#contact` },
    ],
    [home]
  )

  const otherLocale: Locale = locale === "en" ? "ar" : "en"
  const localeHref = languageSwitchHref(pathname, locale)
  const pathWithoutHash = pathname.split("#")[0]

  const isActive = (match: string) => {
    const matchPath = match.split("#")[0]
    if (matchPath === home) return pathWithoutHash === home
    return pathWithoutHash.startsWith(matchPath) && matchPath !== home
  }

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        isScrolled ? "glass shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-width flex h-16 items-center justify-between gap-4 px-6 sm:h-20 sm:px-8 lg:px-16">
        <Link
          href={home}
          onClick={closeMenu}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-sm font-bold text-white"
          >
            Z
          </span>
          {t("site.name")}
        </Link>

        <nav aria-label={t("a11y.primaryNav")} className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.match) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                isActive(item.match)
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-full px-3"
          >
            <Link href={localeHref} hrefLang={otherLocale} aria-label={localeLabel[otherLocale]}>
              <Globe aria-hidden className="h-4 w-4" />
              <span className="text-xs font-semibold">{otherLocale.toUpperCase()}</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            aria-label={t("a11y.toggleTheme")}
          >
            <Sun
              aria-hidden
              className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            />
            <Moon
              aria-hidden
              className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-full md:hidden"
            aria-label={t("a11y.toggleMenu")}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? (
              <X aria-hidden className="h-5 w-5" />
            ) : (
              <Menu aria-hidden className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="glass border-t border-border/50 md:hidden"
        >
          <nav aria-label={t("a11y.primaryNav")} className="flex flex-col gap-1 px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={isActive(item.match) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm transition-colors",
                  isActive(item.match)
                    ? "bg-foreground/5 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
