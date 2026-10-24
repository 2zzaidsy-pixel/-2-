"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Compass,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Quote,
  UserCog,
  Link2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "المقالات", icon: FileText },
  { href: "/admin/site", label: "الهوية والبريد", icon: UserCog },
  { href: "/admin/social", label: "الروابط الاجتماعية", icon: Link2 },
  { href: "/admin/projects", label: "المشاريع", icon: FolderKanban },
  { href: "/admin/fields", label: "مجالات التركيز", icon: Compass },
  { href: "/admin/philosophy", label: "الفلسفة", icon: Quote },
] as const

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [loggingOut, setLoggingOut] = React.useState(false)

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  async function logout() {
    setLoggingOut(true)
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.replace("/admin/login")
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive(item.href, "exact" in item && item.exact)
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            <Icon aria-hidden className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-svh">
      <header className="glass sticky top-0 z-40 border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="grid h-9 w-9 place-items-center rounded-lg hover:bg-foreground/5 md:hidden"
              aria-label="القائمة"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-black dark:text-white">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-100 border border-neutral-300 text-black text-sm font-bold shadow-sm transition-all duration-300 dark:border-transparent dark:bg-gradient-to-br dark:from-[var(--brand-gradient-from)] dark:to-[var(--brand-gradient-to)] dark:text-white"
              >
                A
              </span>
              لوحة التحكم
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/en"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <ExternalLink aria-hidden className="h-4 w-4" />
              <span className="hidden sm:inline">معاينة الموقع</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
            >
              <LogOut aria-hidden className="h-4 w-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-24">{nav}</div>
        </aside>

        {open && (
          <div className="fixed inset-x-0 top-16 z-30 border-b border-border/50 bg-background p-4 md:hidden">
            {nav}
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
