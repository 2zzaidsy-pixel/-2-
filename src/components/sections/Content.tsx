import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/Reveal"
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/ui/brand-icons"
import { socialPlatforms, type SocialPlatform } from "@/data/social"
import { createTranslator, localize, plural, type Locale } from "@/lib/i18n"

const platformIcons = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const

function FollowerCount({ platform, locale }: { platform: SocialPlatform; locale: Locale }) {
  if (platform.followers === null) return null

  return (
    <p className="mt-3 text-xs text-muted-foreground">
      {plural("content.statFollowers", platform.followers, locale)}
    </p>
  )
}

export function Content({ locale }: { locale: Locale }) {
  const t = createTranslator(locale)

  return (
    <section id="content" className="section-padding scroll-mt-24 bg-muted/30">
      <div className="max-width">
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              {t("content.label")}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("content.heading")}
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">{t("content.description")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {socialPlatforms.map((platform, index) => {
            const Icon = platformIcons[platform.id]
            return (
              <Reveal key={platform.id} delay={index * 70}>
                <article className="glass-card flex h-full flex-col items-center rounded-xl p-6 text-center sm:p-8">
                  <div
                    className={`mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${platform.color} text-white shadow-lg`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-lg font-semibold">{platform.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{platform.handle}</p>
                  <p className="my-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {localize(platform.description, locale)}
                  </p>
                  <FollowerCount platform={platform} locale={locale} />

                  <Button asChild variant="outline" size="sm" className="mt-6 w-full">
                    <a href={platform.url} target="_blank" rel="noopener noreferrer">
                      {t("content.follow")}
                    </a>
                  </Button>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal>
          <p className="mt-16 text-center text-lg text-muted-foreground">{t("content.ctaText")}</p>
        </Reveal>
      </div>
    </section>
  )
}
