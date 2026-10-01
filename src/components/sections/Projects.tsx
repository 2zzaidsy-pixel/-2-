import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/Reveal"
import { projects } from "@/data/projects"
import { createTranslator, localize, type Locale } from "@/lib/i18n"

export function Projects({ locale }: { locale: Locale }) {
  const t = createTranslator(locale)
  const home = `/${locale}`

  return (
    <section id="projects" className="section-padding scroll-mt-24 bg-muted/30">
      <div className="max-width">
        <Reveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                {t("projects.label")}
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t("projects.heading")}
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">{t("projects.subtitle")}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`${home}/projects`}>
                {t("projects.viewAll")}
                <ArrowUpRight aria-hidden className="ms-1 h-4 w-4 rtl:scale-x-[-1]" />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 70}>
              <article className="glass-card flex h-full flex-col rounded-xl p-6 sm:p-8">
                <div
                  className={`mb-5 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br ${project.gradient}`}
                >
                  <span aria-hidden className="text-4xl font-bold text-white/25">
                    {project.monogram}
                  </span>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="gradient">{t("projects.status.live")}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {localize(project.category, locale)}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold tracking-tight">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                  >
                    {project.name}
                  </a>
                </h3>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {localize(project.description, locale)}
                </p>

                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    {t("projects.visit")}
                    <ArrowUpRight aria-hidden className="ms-1 h-4 w-4 rtl:scale-x-[-1]" />
                  </a>
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
