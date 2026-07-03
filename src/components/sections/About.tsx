"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation } from "@/lib/i18n"

export function About() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)

  return (
    <section id="about" className="section-padding">
      <div className="max-width">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 text-xs font-medium text-muted-foreground mb-6">
              {t("about.label")}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("about.heading")}
            </h2>
            <Separator className="my-6 w-12" />
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("site.author.bio")}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { label: t("about.fields"), value: "5+" },
                { label: t("about.projects"), value: "1+" },
                { label: t("about.vision"), value: t("about.clear") },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/50 flex items-center justify-center overflow-hidden">
              <Image
                src="/profile.jpg"
                alt={t("site.title")}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 blur-xl" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 blur-lg" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
