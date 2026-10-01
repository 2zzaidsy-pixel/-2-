import { Quote } from "lucide-react"
import { personalPhilosophy, philosophies } from "@/data/philosophy"
import { Reveal } from "@/components/ui/Reveal"
import { createTranslator, localize, type Locale } from "@/lib/i18n"

export function Philosophy({ locale }: { locale: Locale }) {
  const t = createTranslator(locale)

  return (
    <section id="philosophy" className="section-padding scroll-mt-24">
      <div className="max-width">
        <Reveal>
          <div className="mb-14 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              {t("philosophy.label")}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("philosophy.heading")}
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass-card relative mx-auto mb-12 max-w-4xl rounded-2xl p-8 text-center sm:p-12">
            <Quote
              aria-hidden
              className="absolute start-6 top-6 h-12 w-12 text-primary/20 rtl:scale-x-[-1]"
            />
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {localize(personalPhilosophy.statement, locale)}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {philosophies.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <figure className="glass-card h-full rounded-xl p-6 sm:p-8">
                <Quote aria-hidden className="mb-4 h-6 w-6 text-primary/30 rtl:scale-x-[-1]" />
                <blockquote className="mb-4 text-sm font-medium leading-relaxed sm:text-base">
                  {localize(item.quote, locale)}
                </blockquote>
                <figcaption className="text-xs text-muted-foreground">
                  {localize(item.author, locale)}
                </figcaption>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {localize(item.context, locale)}
                </p>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
