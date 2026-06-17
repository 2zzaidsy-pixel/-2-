"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Mail, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/data/site"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation } from "@/lib/i18n"

export function Contact() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)

  return (
    <section id="contact" className="section-padding">
      <div className="max-width">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 text-xs font-medium text-muted-foreground mb-6">
            {t("contact.label")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            {t("contact.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            {t("contact.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="gradient">
              <a href={`mailto:${siteConfig.contact.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                {t("contact.sendEmail")}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("contact.startChat")}
              </a>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 glass-card rounded-xl p-8 sm:p-10 max-w-lg mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">{t("contact.email")}</div>
                <div className="text-xs text-muted-foreground">{t("contact.bestWay")}</div>
              </div>
            </div>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-sm text-primary hover:text-primary/80 transition-colors break-all"
            >
              {siteConfig.contact.email}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
