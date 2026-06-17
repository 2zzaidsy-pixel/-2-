"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { personalPhilosophy, philosophies } from "@/data/philosophy"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation } from "@/lib/i18n"

const philosophyTranslations: Record<string, { ar: { quote: string; context: string } }> = {
  "The unexamined life is not worth living.": {
    ar: {
      quote: "الحياة غير المفحوصة لا تستحق أن تُعاش.",
      context: "تذكير بأن التأمل الذاتي والاستقصاء النقدي هما أساس الوجود ذي المعنى.",
    },
  },
  "Know thyself.": {
    ar: {
      quote: "اعرف نفسك بنفسك.",
      context: "أعمق المعرفة تبدأ بفهم عقلك وتحيزاتك وإمكاناتك.",
    },
  },
  "The greatest discovery of any generation is that human beings can alter their lives by altering their attitudes of mind.": {
    ar: {
      quote: "أعظم اكتشاف في أي جيل هو أن البشر يمكنهم تغيير حياتهم بتغيير مواقفهم العقلية.",
      context: "تصورنا يشكل واقعنا. غيّر طريقة رؤيتك للعالم، وسوف تغير العالم الذي تراه.",
    },
  },
}

export function Philosophy() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)

  return (
    <section id="philosophy" className="section-padding">
      <div className="max-width">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 text-xs font-medium text-muted-foreground mb-6">
            {t("philosophy.label")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("philosophy.heading")}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative glass-card rounded-2xl p-8 sm:p-12 mb-12 text-center max-w-4xl mx-auto"
        >
          <Quote className="h-12 w-12 text-primary/20 absolute top-6 left-6" />
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
            {personalPhilosophy.statement}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {philosophies.map((item, index) => {
            const translated = language === "ar" ? philosophyTranslations[item.quote]?.ar : null
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 sm:p-8"
              >
                <Quote className="h-6 w-6 text-primary/30 mb-4" />
                <blockquote className="text-sm sm:text-base font-medium leading-relaxed mb-4">
                  &ldquo;{translated ? translated.quote : item.quote}&rdquo;
                </blockquote>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{item.author}</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  {translated ? translated.context : item.context}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
