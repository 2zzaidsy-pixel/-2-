import Image from "next/image"
import { Reveal } from "@/components/ui/Reveal"
import { projects } from "@/data/projects"
import { fields } from "@/data/fields"
import { getArticleCount } from "@/lib/articles"
import { createTranslator, type Locale } from "@/lib/i18n"

export function About({ locale }: { locale: Locale }) {
  const t = createTranslator(locale)

  const stats = [
    { value: String(projects.length), label: t("about.statProjects") },
    { value: String(getArticleCount(locale)), label: t("about.statArticles") },
    { value: String(fields.length), label: t("about.statFields") },
  ]

  return (
    <section id="about" className="section-padding scroll-mt-24">
      <div className="max-width">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                {t("about.label")}
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t("about.heading")}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("about.body")}
              </p>

              <div className="mt-10 grid grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-bold text-gradient sm:text-4xl">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/15 to-accent/15">
                <Image
                  src="/profile.jpg"
                  alt={t("site.portraitAlt")}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
