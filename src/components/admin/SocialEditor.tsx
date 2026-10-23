"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import {
  Card,
  Field,
  IconBtn,
  LocalizedField,
  PageIntro,
  SelectInput,
  TextInput,
} from "@/components/admin/form"
import { SaveBar } from "@/components/admin/SaveBar"
import { useResource } from "@/components/admin/useResource"
import type { SocialContent } from "@/lib/admin/schemas"

const colorOptions = [
  { value: "from-red-500 to-rose-600", label: "أحمر" },
  { value: "from-pink-500 to-fuchsia-600", label: "وردي" },
  { value: "from-blue-600 to-indigo-600", label: "أزرق" },
  { value: "from-emerald-500 to-teal-600", label: "أخضر" },
  { value: "from-amber-500 to-orange-600", label: "كهرماني" },
  { value: "from-violet-500 to-purple-600", label: "بنفسجي" },
  { value: "from-sky-500 to-cyan-600", label: "سماوي" },
  { value: "from-slate-600 to-slate-800", label: "رمادي" },
]

const iconHint = "معرّفات الأيقونات المدعومة: youtube, instagram, facebook, website"

function emptyPlatform(): SocialContent[number] {
  return {
    id: `platform-${Date.now().toString(36)}`,
    name: "",
    handle: "",
    url: "https://",
    color: colorOptions[0].value,
    description: { en: "", ar: "" },
    followers: null,
  }
}

export function SocialEditor() {
  const { data, setData, status, error, save, dirty } = useResource<SocialContent>("social")
  const platforms = data ?? []

  function update(index: number, next: Partial<SocialContent[number]>) {
    setData(platforms.map((platform, i) => (i === index ? { ...platform, ...next } : platform)))
  }

  function remove(index: number) {
    setData(platforms.filter((_, i) => i !== index))
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= platforms.length) return
    const copy = [...platforms]
    const [moved] = copy.splice(index, 1)
    copy.splice(target, 0, moved)
    setData(copy)
  }

  return (
    <div>
      <PageIntro
        title="الروابط الاجتماعية"
        description="أضف، عدّل، أو احذف روابط المنصات التي تظهر في قسم «أين أنشر» وفي التذييل."
      />

      {data === null && status === "error" ? (
        <Card title="تعذّر التحميل">{error}</Card>
      ) : data === null ? (
        <Card>جارٍ التحميل…</Card>
      ) : (
        <div className="flex flex-col gap-6">
          {platforms.map((platform, index) => (
            <Card
              key={index}
              title={
                <span className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full bg-gradient-to-br ${platform.color}`} />
                  {platform.name || "منصة جديدة"}
                </span>
              }
              description={platform.url}
            >
              <div className="mb-4 flex items-center justify-end gap-1">
                <IconBtn label="تحريك لأعلى" disabled={index === 0} onClick={() => move(index, -1)}>
                  <ChevronUp className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  label="تحريك لأسفل"
                  disabled={index === platforms.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ChevronDown className="h-4 w-4" />
                </IconBtn>
                <IconBtn label="حذف" danger onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="الاسم" htmlFor={`name-${index}`}>
                  <TextInput
                    id={`name-${index}`}
                    value={platform.name}
                    onChange={(event) => update(index, { name: event.target.value })}
                  />
                </Field>
                <Field label="المعرّف (id)" htmlFor={`id-${index}`} hint={iconHint}>
                  <TextInput
                    id={`id-${index}`}
                    dir="ltr"
                    value={platform.id}
                    onChange={(event) => update(index, { id: event.target.value })}
                  />
                </Field>
                <Field label="المعرّف (handle)" htmlFor={`handle-${index}`}>
                  <TextInput
                    id={`handle-${index}`}
                    dir="ltr"
                    value={platform.handle}
                    onChange={(event) => update(index, { handle: event.target.value })}
                  />
                </Field>
                <Field label="الرابط" htmlFor={`url-${index}`}>
                  <TextInput
                    id={`url-${index}`}
                    dir="ltr"
                    type="url"
                    value={platform.url}
                    onChange={(event) => update(index, { url: event.target.value })}
                  />
                </Field>
                <Field label="اللون" htmlFor={`color-${index}`}>
                  <SelectInput
                    id={`color-${index}`}
                    value={colorOptions.some((option) => option.value === platform.color) ? platform.color : colorOptions[0].value}
                    onChange={(event) => update(index, { color: event.target.value })}
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="عدد المتابعين (اتركه فارغًا لإخفائه)" htmlFor={`followers-${index}`}>
                  <TextInput
                    id={`followers-${index}`}
                    type="number"
                    min={0}
                    value={platform.followers ?? ""}
                    onChange={(event) =>
                      update(index, {
                        followers: event.target.value === "" ? null : Number(event.target.value),
                      })
                    }
                  />
                </Field>
              </div>

              <div className="mt-4">
                <LocalizedField
                  label="الوصف"
                  value={platform.description}
                  onChange={(next) => update(index, { description: next })}
                />
              </div>
            </Card>
          ))}

          <button
            type="button"
            onClick={() => setData([...platforms, emptyPlatform()])}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            إضافة منصة
          </button>

          <SaveBar status={status} error={error} dirty={dirty} onSave={() => void save(platforms)} />
        </div>
      )}
    </div>
  )
}
