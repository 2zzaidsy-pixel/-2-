"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) {
        setError(
          response.status === 401 ? "كلمة المرور غير صحيحة." : "تعذّر تسجيل الدخول. حاول مجددًا."
        )
        return
      }
      router.replace("/admin")
      router.refresh()
    } catch {
      setError("تعذّر الاتصال بالخادم.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <span
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white"
        >
          <Lock className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-xl font-bold">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-muted-foreground">أدخل كلمة المرور للمتابعة.</p>
      </div>

      <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
        كلمة المرور
      </label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-primary"
        required
      />

      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "جارٍ الدخول…" : "دخول"}
      </button>
    </form>
  )
}
