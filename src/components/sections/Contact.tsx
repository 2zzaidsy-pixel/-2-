import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/Reveal"
import { YoutubeIcon } from "@/components/ui/brand-icons"
import { siteConfig } from "@/data/site"
import { createTranslator, type Locale } from "@/lib/i18n"

export function Contact({ locale }: { locale: Locale }) {
  const t = createTranslator(locale)
  const email = siteConfig.contact.email

  return (
    <section id="contact" className="section-padding scroll-mt-24">
      <div className="max-width">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              {t("contact.label")}
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("contact.heading")}
            </h2>
            <p className="mx-auto mb-10 max-w-xl leading-relaxed text-muted-foreground">
              {t("contact.subtitle")}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="gradient">
                <a href={`mailto:${email}`}>
                  <Mail aria-hidden className="me-2 h-4 w-4" />
                  {t("contact.sendEmail")}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer">
                  <YoutubeIcon className="me-2 h-4 w-4" />
                  {t("contact.watchChannel")}
                </a>
              </Button>
            </div>

            <div className="glass-card mx-auto mt-16 max-w-lg rounded-xl p-8 text-start sm:p-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail aria-hidden className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("contact.emailLabel")}</p>
                  <p className="text-xs text-muted-foreground">{t("contact.emailHint")}</p>
                </div>
              </div>
              <a
                href={`mailto:${email}`}
                className="break-all text-sm text-primary transition-colors hover:text-primary/80"
                dir="ltr"
              >
                {email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
