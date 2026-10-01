import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/Reveal"
import { projects } from "@/data/projects"
import { createTranslator, localize, type Locale } from "@/lib/i18n"

export function ProjectsPage({ locale }: { locale: Locale }) {
  const t = createTranslator(locale)
  const home = `/${locale}`

  return (
    <section className="pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="max-width px-6 sm:px-8 lg:px-16">
        <Reveal>
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href={home}>
              <ArrowLeft aria-hidden className="me-2 h-4 w-4 rtl:scale-x-[-1]" />
              {t("error.home")}
            </Link>
          </Button>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            {t("projects.label")}
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("projects.heading")}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {t("projects.subtitle")}
          </p>
        </Reveal>

        <div className="mt-16 space-y-10">
          {projects.map((project, index) => {
            const highlights = locale === "ar" ? project.highlights.ar : project.highlights.en
            return (
              <Reveal key={project.id} delay={index * 60}>
                <article className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="flex flex-col justify-center p-8 sm:p-12">
                      <div className="mb-4 flex items-center gap-2">
                        <Badge variant="gradient">{t("projects.status.live")}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {localize(project.category, locale)}
                        </span>
                      </div>

                      <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                        {project.name}
                      </h2>

                      <p className="mb-6 leading-relaxed text-muted-foreground">
                        {localize(project.description, locale)}
                      </p>

                      <ul className="mb-8 space-y-3">
                        {highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-3 text-sm text-muted-foreground">
                            <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span className="leading-relaxed">{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      <Button asChild size="lg" variant="gradient" className="w-fit">
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          {t("projects.visit")}
                          <ArrowUpRight aria-hidden className="ms-2 h-4 w-4 rtl:scale-x-[-1]" />
                        </a>
                      </Button>
                    </div>

                    <div
                      className={`flex min-h-[220px] items-center justify-center bg-gradient-to-br ${project.gradient} p-10 lg:min-h-full`}
                    >
                      <span aria-hidden className="text-6xl font-bold text-white/25 sm:text-7xl">
                        {project.monogram}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
