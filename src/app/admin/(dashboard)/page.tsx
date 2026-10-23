import Link from "next/link"
import {
  Compass,
  FileText,
  FolderKanban,
  Quote,
  UserCog,
  Link2,
  type LucideIcon,
} from "lucide-react"
import { listArticles, type AdminArticle } from "@/lib/admin/articles"

export const dynamic = "force-dynamic"

const cards = [
  {
    href: "/admin/articles",
    label: "المقالات",
    description: "أنشئ، حرّر، وانشر المقالات بنص Markdown.",
    icon: FileText,
  },
  {
    href: "/admin/site",
    label: "الهوية والبريد",
    description: "الاسم، الوصف، البايو، البريد، والصورة الشخصية.",
    icon: UserCog,
  },
  {
    href: "/admin/social",
    label: "الروابط الاجتماعية",
    description: "أضف أو عدّل أو احذف روابط المنصات.",
    icon: Link2,
  },
  {
    href: "/admin/projects",
    label: "المشاريع",
    description: "تحكّم في قائمة المشاريع وروابطها ووصفها.",
    icon: FolderKanban,
  },
  {
    href: "/admin/fields",
    label: "مجالات التركيز",
    description: "المجالات الخمسة التي تظهر في الصفحة الرئيسية.",
    icon: Compass,
  },
  {
    href: "/admin/philosophy",
    label: "الفلسفة",
    description: "الاقتباسات وفلسفتك الشخصية.",
    icon: Quote,
  },
] satisfies { href: string; label: string; description: string; icon: LucideIcon }[]

interface LocaleStats {
  total: number
  published: number
  drafts: number
  featured: number
  latest: string | null
}

function summarize(articles: AdminArticle[]): LocaleStats {
  const latest = articles.reduce<string | null>((current, article) => {
    const date = article.frontmatter.date
    return !current || date > current ? date : current
  }, null)
  return {
    total: articles.length,
    published: articles.filter((article) => article.frontmatter.published).length,
    drafts: articles.filter((article) => !article.frontmatter.published).length,
    featured: articles.filter((article) => article.frontmatter.featured).length,
    latest,
  }
}

async function loadStats(): Promise<Record<"ar" | "en", LocaleStats> | null> {
  try {
    const [ar, en] = await Promise.all([listArticles("ar"), listArticles("en")])
    return { ar: summarize(ar), en: summarize(en) }
  } catch {
    return null
  }
}

export default async function AdminDashboardPage() {
  const stats = await loadStats()

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        كل تعديل هنا يُحفظ كـ commit على GitHub، ثم يُعيد Vercel بناء الموقع تلقائيًا خلال دقيقة تقريبًا.
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">إحصاءات المقالات</h2>
        {stats === null ? (
          <div className="rounded-xl border border-border/60 bg-card p-5 text-sm text-muted-foreground">
            تعذّر تحميل الإحصاءات. تأكّد من ضبط متغيّرات GitHub.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile
              label="مقالات عربية"
              value={stats.ar.total}
              hint={`${stats.ar.published} منشور · ${stats.ar.drafts} مسودة`}
            />
            <StatTile
              label="مقالات إنجليزية"
              value={stats.en.total}
              hint={`${stats.en.published} منشور · ${stats.en.drafts} مسودة`}
            />
            <StatTile
              label="مميّزة"
              value={stats.ar.featured + stats.en.featured}
              hint="عربي وإنجليزي"
            />
            <StatTile
              label="آخر مقال"
              value={stats.ar.latest ?? stats.en.latest ?? "—"}
              hint="أحدث تاريخ نشر"
            />
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">أقسام التحرير</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.href}
                href={card.href}
                className="glass-card group rounded-xl border border-border/60 p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className="font-semibold">{card.label}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function StatTile({
  label,
  value,
  hint,
}: {
  label: string
  value: number | string
  hint: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  )
}
