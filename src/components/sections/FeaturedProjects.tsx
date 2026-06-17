"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { projects } from "@/data/projects"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation } from "@/lib/i18n"

export function FeaturedProjects() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)
  const featuredProject = projects[0]

  return (
    <section id="projects" className="section-padding bg-muted/30">
      <div className="max-width">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 text-xs font-medium text-muted-foreground mb-6">
              {t("projects.label")}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t("projects.featured")}
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/projects">
              {t("projects.viewAll")}
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {featuredProject && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-500 group">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="gradient">{featuredProject.status === "active" ? t("projects.active") : t("projects.comingSoon")}</Badge>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                      {featuredProject.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {featuredProject.longDescription}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {featuredProject.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        asChild
                        size="lg"
                        variant="gradient"
                        className="group/btn"
                      >
                        <a href={featuredProject.href} target="_blank" rel="noopener noreferrer">
                          {t("projects.enterSystem")}
                          <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className={`relative min-h-[200px] lg:min-h-full bg-gradient-to-br ${featuredProject.gradient} flex items-center justify-center p-8 sm:p-12`}>
                    <div className="text-center">
                      <div className="text-5xl sm:text-6xl font-bold text-white/20 select-none">
                        {featuredProject.title.split(" ")[0]}
                      </div>
                      <div className="mt-4 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                        <ExternalLink className="h-6 w-6 text-white/60" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  )
}
