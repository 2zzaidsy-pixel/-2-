"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ExternalLink, Play, Users, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation } from "@/lib/i18n"

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

const socialPlatforms = [
  {
    id: "youtube",
    name: "YouTube",
    icon: YoutubeIcon,
    color: "from-red-500 to-red-600",
    bgGlow: "bg-red-500/10",
    href: "https://www.youtube.com/channel/UCyk0wcexoOFlxCV8vylCsLA",
    description: "Tutorials, tech reviews, and project walkthroughs.",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: InstagramIcon,
    color: "from-pink-500 to-purple-600",
    bgGlow: "bg-pink-500/10",
    href: "https://www.instagram.com/zerotime_z?igsh=NjJva3NhYXJ3bnVi",
    description: "Daily insights, behind-the-scenes, and visual stories.",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: FacebookIcon,
    color: "from-blue-500 to-blue-600",
    bgGlow: "bg-blue-500/10",
    href: "https://www.facebook.com/2zzaid",
    description: "Community discussions, updates, and live sessions.",
  },
]

function AnimatedCounter({
  end,
  suffix,
  label,
  icon: Icon,
  delay,
}: {
  end: number
  suffix: string
  label: string
  icon: React.ElementType
  delay: number
}) {
  const [count, setCount] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)
  const hasAnimated = React.useRef(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const steps = 60
          const increment = end / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-gradient">
        {count}
        {suffix}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  )
}

export function ContentCreator() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)

  return (
    <section id="content-creator" className="section-padding bg-muted/30">
      <div className="max-width">
        {/* About Me */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 text-xs font-medium text-muted-foreground mb-6">
            Content Creator
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("creator.heading")}
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("creator.description")}
          </p>
        </motion.div>

        {/* Social Media Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {socialPlatforms.map((platform, index) => {
            const Icon = platform.icon
            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <a
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full"
                >
                  <Card className="h-full overflow-hidden border-border/50 hover:shadow-lg transition-all duration-500 group">
                    <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center h-full">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.color} text-white mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                        {platform.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group/btn"
                        onClick={(e) => {
                          e.preventDefault()
                          window.open(platform.href, "_blank", "noopener,noreferrer")
                        }}
                      >
                        {t("creator.follow")}
                        <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                      </Button>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            )
          })}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card rounded-2xl p-8 sm:p-12 mb-20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            <AnimatedCounter
              end={120}
              suffix="+"
              label={t("creator.statVideos")}
              icon={Play}
              delay={0}
            />
            <AnimatedCounter
              end={25}
              suffix="K+"
              label={t("creator.statSubscribers")}
              icon={Users}
              delay={0.15}
            />
            <AnimatedCounter
              end={60}
              suffix="K+"
              label={t("creator.statFollowers")}
              icon={Eye}
              delay={0.3}
            />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            {t("creator.ctaText")}
          </p>
          <Button
            asChild
            size="xl"
            variant="gradient"
            className="group/cta"
          >
            <a
              href="https://www.youtube.com/channel/UCyk0wcexoOFlxCV8vylCsLA"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("creator.ctaButton")}
              <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover/cta:translate-x-0.5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
