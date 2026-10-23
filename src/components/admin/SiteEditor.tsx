"use client"

import * as React from "react"
import { Loader2, Upload } from "lucide-react"
import { Card, Field, LocalizedField, TextInput } from "@/components/admin/form"
import { SaveBar } from "@/components/admin/SaveBar"
import { useSite, type SiteData } from "@/components/admin/useResource"
import { identityKeys, type IdentityKey } from "@/lib/admin/identity"

const identityLabels: Record<IdentityKey, string> = {
  "site.name": "الاسم الظاهر",
  "site.tagline": "الشعار النصي (tagline)",
  "site.description": "وصف مختصر",
  "site.role": "المسمّى الوظيفي",
  "site.bio": "نبذة تعريفية",
  "site.portraitAlt": "نص بديل للصورة الشخصية",
}

export function SiteEditor() {
  const { data, setData, status, error, save, dirty } = useSite()
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  function updateSite(patch: Partial<NonNullable<SiteData["site"]>>) {
    if (!data) return
    setData({ ...data, site: { ...data.site, ...patch } })
  }

  function updateIdentity(locale: "en" | "ar", key: IdentityKey, value: string) {
    if (!data) return
    setData({
      ...data,
      messages: {
        ...data.messages,
        [locale]: { ...data.messages[locale], [key]: value },
      },
    })
  }

  async function upload(file: File) {
    setUploading(true)
    setUploadError(null)
    try {
      const body = new FormData()
      body.append("file", file)
      const response = await fetch("/api/admin/upload", { method: "POST", body })
      const payload = (await response.json().catch(() => ({}))) as {
        url?: string
        message?: string
      }
      if (!response.ok) {
        throw new Error(payload.message ?? "تعذّر رفع الصورة.")
      }
      if (payload.url) updateSite({ image: payload.url })
    } catch (caught) {
      setUploadError(caught instanceof Error ? caught.message : "تعذّر رفع الصورة.")
    } finally {
      setUploading(false)
    }
  }

  if (!data) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold tracking-tight">الهوية والبريد والصورة</h1>
        <Card>{status === "error" ? error : "جارٍ التحميل…"}</Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">الهوية والبريد والصورة</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          الاسم والنبذة يظهران باللغتين. البريد والصورة يشاركان في كل اللغات.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Card title="الصورة الشخصية" description="تظهر في قسمي البطل ونبذة عني.">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-primary/15 to-accent/15">
              {data.site.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.site.image}
                  alt="معاينة الصورة الشخصية"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:border-primary/40 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? "جارٍ الرفع…" : "رفع صورة جديدة"}
              </button>
              <code dir="ltr" className="text-xs text-muted-foreground">
                {data.site.image}
              </code>
              {uploadError && (
                <p role="alert" className="text-xs text-destructive">
                  {uploadError}
                </p>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void upload(file)
                  event.target.value = ""
                }}
              />
            </div>
          </div>
        </Card>

        <Card title="البريد الإلكتروني" description="يظهر في قسم التواصل والتذييل وبيانات JSON-LD.">
          <Field label="البريد" htmlFor="email">
            <TextInput
              id="email"
              dir="ltr"
              type="email"
              value={data.site.contact.email}
              onChange={(event) =>
                updateSite({ contact: { ...data.site.contact, email: event.target.value } })
              }
            />
          </Field>
        </Card>

        <Card title="الهوية" description="يُحرّر كل حقل بالإنجليزية والعربية معًا.">
          <div className="flex flex-col gap-5">
            {identityKeys.map((key) => (
              <LocalizedField
                key={key}
                label={identityLabels[key]}
                rows={key === "site.bio" || key === "site.description" ? 3 : 1}
                value={{
                  en: data.messages.en[key] ?? "",
                  ar: data.messages.ar[key] ?? "",
                }}
                onChange={(next) => {
                  updateIdentity("en", key, next.en)
                  updateIdentity("ar", key, next.ar)
                }}
              />
            ))}
          </div>
        </Card>

        <SaveBar status={status} error={error} dirty={dirty} onSave={() => void save(data)} />
      </div>
    </div>
  )
}
