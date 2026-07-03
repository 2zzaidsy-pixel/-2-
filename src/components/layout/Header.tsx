"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Menu, X, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/layout/LanguageProvider"
import { getTranslation, type Language } from "@/lib/i18n"

const navKeys = [
  { href: "/", key: "nav.home" },
  { href: "/#about", key: "nav.about" },
  { href: "/#fields", key: "nav.fields" },
  { href: "/#philosophy", key: "nav.philosophy" },
  { href: "/blog", key: "nav.blog" },
  { href: "/projects", key: "nav.projects" },
  { href: "/#contact", key: "nav.contact" },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const t = (key: string) => getTranslation(key, language)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en")
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "glass shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-width flex items-center justify-between h-16 sm:h-20 px-6 sm:px-8 lg:px-16">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity"
        >
          {t("site.title")}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navKeys.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm rounded-lg transition-all duration-200",
                pathname === link.href
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="rounded-full"
            aria-label="Toggle language"
          >
            <Globe className="h-5 w-5" />
            <span className="text-[10px] font-bold absolute">
              {language === "en" ? "EN" : "AR"}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass border-t border-border/50 overflow-hidden md:hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navKeys.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-3 text-sm rounded-lg transition-all duration-200",
                    pathname === link.href
                      ? "text-foreground font-medium bg-accent/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  )}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
