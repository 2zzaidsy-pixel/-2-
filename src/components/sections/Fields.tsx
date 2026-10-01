import { Brain, Users, TrendingUp, Activity, Lightbulb, type LucideIcon } from "lucide-react"
import { fields, type Field } from "@/data/fields"
import { Reveal } from "@/components/ui/Reveal"
import { createTranslator, localize, type Locale } from "@/lib/i18n"

const iconMap: Record<Field["icon"], LucideIcon> = {
  brain: Brain,
  users: Users,
  "trending-up": TrendingUp,
  activity: Activity,
  lightbulb: Lightbulb,
}

export function Fields({ locale }: { locale: Locale }) {
  const t = createTranslator(locale)

  return (
    <section id="fields" className="section-padding scroll-mt-24 bg-muted/30">
      <div className="max-width">
        <Reveal>
          <div className="mb-14 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              {t("fields.label")}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("fields.heading")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("fields.subtitle")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field, index) => {
            const Icon = iconMap[field.icon]
            return (
              <Reveal key={field.id} delay={index * 70}>
                <article className="glass-card h-full rounded-xl p-6 sm:p-8">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${field.color} text-white`}
                  >
                    <Icon aria-hidden className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{localize(field.title, locale)}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {localize(field.description, locale)}
                  </p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
