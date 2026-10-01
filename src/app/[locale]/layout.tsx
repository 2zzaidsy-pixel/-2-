import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Cairo } from "next/font/google"
import { notFound } from "next/navigation"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { constructMetadata } from "@/lib/metadata"
import { createTranslator, isLocale, localeDir, locales, type Locale } from "@/lib/i18n"
import { siteConfig } from "@/data/site"
import "../globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
})

interface LocaleParams {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "dark light",
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return constructMetadata({ locale })
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode }> & LocaleParams) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const typedLocale: Locale = locale
  const t = createTranslator(typedLocale)
  const dir = localeDir[typedLocale]

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: t("site.name"),
    description: t("site.bio"),
    image: `${siteConfig.url}${siteConfig.image}`,
    url: `${siteConfig.url}/${typedLocale}`,
    email: `mailto:${siteConfig.contact.email}`,
    sameAs: Object.values(siteConfig.social),
  }

  return (
    <html
      lang={typedLocale}
      dir={dir}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable}`}
    >
      <body className="flex min-h-svh flex-col bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          >
            {t("a11y.skipToContent")}
          </a>

          <Header locale={typedLocale} />

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <Footer locale={typedLocale} />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
