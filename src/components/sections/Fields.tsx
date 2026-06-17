"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Brain, Users, TrendingUp, Activity, Lightbulb } from "lucide-react"
import { fields } from "@/data/fields"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation } from "@/lib/i18n"

const iconMap: Record<string, React.ReactNode> = {
  "brain": <Brain className="h-6 w-6" />,
  "users": <Users className="h-6 w-6" />,
  "trending-up": <TrendingUp className="h-6 w-6" />,
  "activity": <Activity className="h-6 w-6" />,
  "lightbulb": <Lightbulb className="h-6 w-6" />,
}

export function Fields() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)

  return (
    <section id="fields" className="section-padding bg-muted/30">
      <div className="max-width">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 text-xs font-medium text-muted-foreground mb-6">
            {t("fields.label")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("fields.heading")}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {t("fields.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="glass-card rounded-xl p-6 sm:p-8 h-full">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${field.color} text-white mb-4`}>
                  {iconMap[field.icon]}
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {language === "ar" ? field.titleAr : field.title}
                </h3>
                {language === "ar" ? (
                  <p className="text-xs text-muted-foreground mb-3">{field.title}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mb-3">{field.titleAr}</p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {field.description}
                </p>
              </div>
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${field.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
