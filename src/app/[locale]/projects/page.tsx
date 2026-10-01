import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ProjectsPage } from "@/components/sections/ProjectsPage"
import { constructMetadata } from "@/lib/metadata"
import { createTranslator, isLocale } from "@/lib/i18n"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const t = createTranslator(locale)
  return constructMetadata({
    locale,
    title: t("projects.heading"),
    description: t("projects.subtitle"),
    path: `/${locale}/projects`,
  })
}

export default async function ProjectsRoute({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return <ProjectsPage locale={locale} />
}
