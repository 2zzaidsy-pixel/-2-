"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { projects } from "@/data/projects"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation } from "@/lib/i18n"

export function ProjectsContent() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)
  const [featured, ...rest] = projects

  return (
    <>
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-20">
        <div className="max-width px-6 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button asChild variant="ghost" size="sm" className="mb-8">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("projects.backHome")}
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 text-xs font-medium text-muted-foreground mb-6">
              {t("projects.label")}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("projects.myProjects")}
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl leading-relaxed">
              {t("projects.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {featured && (
        <section className="pb-24 sm:pb-32">
          <div className="max-width px-6 sm:px-8 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
                <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient} opacity-5`} />
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-12 lg:p-16">
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="gradient">
                        {featured.status === "active" ? t("projects.activeProject") : t("projects.comingSoon")}
                      </Badge>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {featured.longDescription}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {featured.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <Button asChild size="lg" variant="gradient" className="w-fit group">
                      <a href={featured.href} target="_blank" rel="noopener noreferrer">
                        {t("projects.enterSystem")}
                        <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </Button>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <div className="w-full aspect-square max-w-sm rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="text-4xl font-bold text-gradient mb-2">The System</div>
                        <div className="text-xs text-muted-foreground">{t("projects.lifeMgmt")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="pb-24 sm:pb-32">
          <div className="max-width px-6 sm:px-8 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold tracking-tight mb-8">
                {t("projects.other")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="glass-card rounded-xl p-6 sm:p-8"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">
                        {project.status === "coming-soon" ? t("projects.comingSoon") : project.status}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {project.longDescription}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}
