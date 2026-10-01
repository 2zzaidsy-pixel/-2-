import Link from "next/link"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createTranslator, type Locale } from "@/lib/i18n"

export function Hero({ locale }: { locale: Locale }) {
  const t = createTranslator(locale)
  const home = `/${locale}`

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden pb-24">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="animate-pulse-glow absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="animate-pulse-glow absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="max-width px-6 text-center sm:px-8 lg:px-16">
        <div className="animate-fade-in-up">
          <div className="relative mx-auto mb-8 inline-block">
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-border/60 shadow-xl sm:h-28 sm:w-28">
              <Image
                src="/profile.jpg"
                alt={t("site.portraitAlt")}
                width={112}
                height={112}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div
          className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          style={{ animationDelay: "80ms" }}
        >
          <span aria-hidden className="h-2 w-2 rounded-full bg-primary" />
          {t("hero.badge")}
        </div>

        <h1
          className="animate-fade-in-up text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: "140ms" }}
        >
          {t("site.name")}
          <span className="mt-2 block text-gradient">{t("site.tagline")}</span>
        </h1>

        <p
          className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          style={{ animationDelay: "220ms" }}
        >
          {t("hero.description")}
        </p>

        <div
          className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "300ms" }}
        >
          <Button asChild size="lg" variant="gradient">
            <Link href={`${home}/projects`}>{t("hero.primaryCta")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={`${home}/blog`}>{t("hero.secondaryCta")}</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 start-1/2 -translate-x-1/2 rtl:translate-x-1/2">
        <Link
          href={`${home}#about`}
          className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="text-xs font-medium">{t("hero.scroll")}</span>
          <ArrowDown aria-hidden className="h-4 w-4 animate-bounce" />
        </Link>
      </div>
    </section>
  )
}
