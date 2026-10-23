import { BookOpen, GraduationCap, PenLine } from "lucide-react"
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

  const identities = [
    { Icon: GraduationCap, title: t("about.identity1"), detail: t("about.identity1Detail") },
    { Icon: BookOpen, title: t("about.identity2"), detail: t("about.identity2Detail") },
    { Icon: PenLine, title: t("about.identity3"), detail: t("about.identity3Detail") },
  ]

  return (
    <section id="about" className="scroll-mt-24 py-16 sm:py-20">
      <div className="max-width">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              {t("about.label")}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("about.heading")}
            </h2>

            <div className="glass-card mt-8 divide-y divide-border/40 overflow-hidden rounded-2xl">
              {identities.map(({ Icon, title, detail }) => (
                <div key={title} className="flex gap-4 p-5 sm:p-6">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("about.body")}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-gradient sm:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
