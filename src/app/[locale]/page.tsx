import { notFound } from "next/navigation"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Fields } from "@/components/sections/Fields"
import { Philosophy } from "@/components/sections/Philosophy"
import { Projects } from "@/components/sections/Projects"
import { Content } from "@/components/sections/Content"
import { Contact } from "@/components/sections/Contact"
import { getArticleCount } from "@/lib/articles"
import { constructMetadata } from "@/lib/metadata"
import { isLocale } from "@/lib/i18n"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return constructMetadata({ locale, path: `/${locale}` })
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const articles = getArticleCount(locale)

  return (
    <>
      <Hero locale={locale} />
      <About locale={locale} />
      <Fields locale={locale} />
      <Philosophy locale={locale} />
      <Projects locale={locale} />
      {articles > 0 && <Content locale={locale} />}
      <Contact locale={locale} />
    </>
  )
}
