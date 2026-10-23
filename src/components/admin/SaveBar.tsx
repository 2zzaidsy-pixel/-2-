"use client"

import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SaveStatus } from "@/components/admin/useResource"

export function SaveBar({
  status,
  error,
  onSave,
  saveLabel = "حفظ",
  dirty = true,
  extra,
}: {
  status: SaveStatus
  error?: string | null
  onSave: () => void
  saveLabel?: string
  dirty?: boolean
  extra?: React.ReactNode
}) {
  const saving = status === "saving"

  return (
    <div className="sticky bottom-4 z-30 mt-8 rounded-xl border border-border/60 bg-card/95 p-4 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-5 flex-1 text-sm">
          {error && status === "error" && (
            <p className="flex items-start gap-2 text-destructive">
              <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="whitespace-pre-wrap">{error}</span>
            </p>
          )}
          {status === "saved" && (
            <p className="flex items-center gap-2 text-emerald-500">
              <CheckCircle2 aria-hidden className="h-4 w-4" />
              تم الحفظ — سيتم إعادة بناء الموقع تلقائيًا خلال دقيقة.
            </p>
          )}
          {status === "saving" && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
              جارٍ الحفظ…
            </p>
          )}
          {status === "idle" && (
            <p className="text-muted-foreground">
              {dirty ? "توجد تغييرات غير محفوظة." : "لا توجد تغييرات غير محفوظة."}
            </p>
          )}
          {status === "loading" && <p className="text-muted-foreground">جارٍ التحميل…</p>}
        </div>

        <div className="flex items-center gap-3">
          {extra}
          <button
            type="button"
            onClick={onSave}
            disabled={saving || status === "loading"}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            )}
          >
            {saving ? (
              <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            ) : (
              <Save aria-hidden className="h-4 w-4" />
            )}
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
