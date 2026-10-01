import Link from "next/link"
import { siteConfig } from "@/data/site"
import { socialPlatforms } from "@/data/social"
import { createTranslator, localize, type Locale } from "@/lib/i18n"

export function Footer({ locale }: { locale: Locale }) {
  const t = createTranslator(locale)
  const home = `/${locale}`

  const explore = [
    { href: home, label: t("nav.home") },
    { href: `${home}/#about`, label: t("nav.about") },
    { href: `${home}/#fields`, label: t("nav.fields") },
    { href: `${home}/#philosophy`, label: t("nav.philosophy") },
    { href: `${home}/blog`, label: t("nav.blog") },
    { href: `${home}/projects`, label: t("nav.projects") },
  ]

  return (
    <footer className="border-t border-border/50">
      <div className="max-width px-6 py-14 sm:px-8 sm:py-16 lg:px-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href={home} className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-sm font-bold text-white"
              >
                Z
              </span>
              {t("site.name")}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("site.description")}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">{t("footer.tagline")}</p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold">{t("footer.explore")}</h2>
            <ul className="space-y-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold">{t("footer.connect")}</h2>
            <ul className="space-y-3">
              {socialPlatforms.map((platform) => (
                <li key={platform.id}>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {platform.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.email")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {t("site.name")}. {t("footer.rights")}
          </p>
          <p className="text-xs text-muted-foreground">
            {localize({ en: "Made with Next.js", ar: "مبني بـ Next.js" }, locale)}
          </p>
        </div>
      </div>
    </footer>
  )
}
