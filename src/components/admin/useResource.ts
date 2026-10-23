"use client"

import * as React from "react"

export type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error"

interface ApiError {
  error?: string
  message?: string
  issues?: { path: string; message: string }[]
}

export function formatApiError(payload: ApiError): string {
  if (payload.issues?.length) {
    return payload.issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n")
  }
  if (payload.message) return payload.message
  return payload.error ?? "تعذّر تنفيذ الطلب."
}

export async function readPayload<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T & ApiError
  if (!response.ok) throw new Error(formatApiError(payload))
  return payload
}

function useStatusReset(status: SaveStatus, setStatus: (next: SaveStatus) => void) {
  React.useEffect(() => {
    if (status !== "saved") return
    const timer = setTimeout(() => setStatus("idle"), 2500)
    return () => clearTimeout(timer)
  }, [status, setStatus])
}

/** Warns before the tab is closed/reloaded while there are unsaved edits. */
export function useUnsavedWarning(dirty: boolean) {
  React.useEffect(() => {
    if (!dirty) return
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])
}

function useDirty(value: unknown, baseline: string | null): boolean {
  return React.useMemo(() => {
    if (baseline === null) return false
    return JSON.stringify(value) !== baseline
  }, [value, baseline])
}

export function useResource<T>(resource: string) {
  const [data, setData] = React.useState<T | null>(null)
  const [baseline, setBaseline] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<SaveStatus>("loading")
  const [error, setError] = React.useState<string | null>(null)

  const dirty = useDirty(data, baseline)
  useStatusReset(status, setStatus)
  useUnsavedWarning(dirty)

  React.useEffect(() => {
    let active = true
    fetch(`/api/admin/content/${resource}`)
      .then(async (response) => {
        const payload = await readPayload<{ data: T }>(response)
        if (!active) return
        setData(payload.data)
        setBaseline(JSON.stringify(payload.data))
        setStatus("idle")
      })
      .catch((caught: unknown) => {
        if (!active) return
        setError(caught instanceof Error ? caught.message : String(caught))
        setStatus("error")
      })
    return () => {
      active = false
    }
  }, [resource])

  const save = React.useCallback(
    async (next: T): Promise<boolean> => {
      setStatus("saving")
      setError(null)
      try {
        const payload = await readPayload<{ data: T }>(
          await fetch(`/api/admin/content/${resource}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next),
          })
        )
        setData(payload.data)
        setBaseline(JSON.stringify(payload.data))
        setStatus("saved")
        return true
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : String(caught))
        setStatus("error")
        return false
      }
    },
    [resource]
  )

  return { data, setData, status, error, save, dirty }
}

export interface SiteData {
  site: { image: string; description: string; contact: { email: string } }
  messages: Record<"en" | "ar", Record<string, string>>
}

export function useSite() {
  const [data, setData] = React.useState<SiteData | null>(null)
  const [baseline, setBaseline] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<SaveStatus>("loading")
  const [error, setError] = React.useState<string | null>(null)

  const dirty = useDirty(data, baseline)
  useStatusReset(status, setStatus)
  useUnsavedWarning(dirty)

  React.useEffect(() => {
    let active = true
    fetch("/api/admin/site")
      .then(async (response) => {
        const payload = await readPayload<SiteData>(response)
        if (!active) return
        setData(payload)
        setBaseline(JSON.stringify(payload))
        setStatus("idle")
      })
      .catch((caught: unknown) => {
        if (!active) return
        setError(caught instanceof Error ? caught.message : String(caught))
        setStatus("error")
      })
    return () => {
      active = false
    }
  }, [])

  const save = React.useCallback(async (next: SiteData): Promise<boolean> => {
    setStatus("saving")
    setError(null)
    try {
      await readPayload(
        await fetch("/api/admin/site", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        })
      )
      setData(next)
      setBaseline(JSON.stringify(next))
      setStatus("saved")
      return true
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
      setStatus("error")
      return false
    }
  }, [])

  return { data, setData, status, error, save, dirty }
}
