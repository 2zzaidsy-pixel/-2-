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
import { fieldIcon, type FieldsContent } from "@/lib/admin/schemas"

const iconOptions = [
  { value: "brain", label: "مخ" },
  { value: "users", label: "مستخدمون" },
  { value: "trending-up", label: "اتجاه صاعد" },
  { value: "activity", label: "نشاط" },
  { value: "lightbulb", label: "فكرة" },
  { value: "landmark", label: "فلسفة" },
  { value: "network", label: "شبكة" },
] as const

const colorOptions = [
  { value: "from-violet-500 to-purple-600", label: "بنفسجي" },
  { value: "from-amber-500 to-orange-600", label: "كهرماني" },
  { value: "from-emerald-500 to-teal-600", label: "أخضر" },
  { value: "from-blue-500 to-cyan-600", label: "أزرق" },
  { value: "from-rose-500 to-pink-600", label: "وردي" },
  { value: "from-sky-500 to-indigo-600", label: "سماوي" },
]

function emptyField(): FieldsContent[number] {
  return {
    id: `field-${Date.now().toString(36)}`,
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    icon: fieldIcon.options[0],
    color: colorOptions[0].value,
  }
}

export function FieldsEditor() {
  const { data, setData, status, error, save, dirty } = useResource<FieldsContent>("fields")
  const fields = data ?? []

  function update(index: number, next: Partial<FieldsContent[number]>) {
    setData(fields.map((field, i) => (i === index ? { ...field, ...next } : field)))
  }

  function remove(index: number) {
    setData(fields.filter((_, i) => i !== index))
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= fields.length) return
    const copy = [...fields]
    const [moved] = copy.splice(index, 1)
    copy.splice(target, 0, moved)
    setData(copy)
  }

  return (
    <div>
      <PageIntro
        title="مجالات التركيز"
        description="المساحات الخمسة التي تظهر في قسم «ما الذي أفكّر فيه باستمرار»."
      />

      {data === null && status === "error" ? (
        <Card title="تعذّر التحميل">{error}</Card>
      ) : data === null ? (
        <Card>جارٍ التحميل…</Card>
      ) : (
        <div className="flex flex-col gap-6">
          {fields.map((field, index) => (
            <Card
              key={index}
              title={
                <span className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full bg-gradient-to-br ${field.color}`} />
                  {field.title.en || field.title.ar || "مجال جديد"}
                </span>
              }
            >
              <div className="mb-4 flex items-center justify-end gap-1">
                <IconBtn label="تحريك لأعلى" disabled={index === 0} onClick={() => move(index, -1)}>
                  <ChevronUp className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  label="تحريك لأسفل"
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ChevronDown className="h-4 w-4" />
                </IconBtn>
                <IconBtn label="حذف" danger onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="المعرّف (id)" htmlFor={`id-${index}`}>
                  <TextInput
                    id={`id-${index}`}
                    dir="ltr"
                    value={field.id}
                    onChange={(event) => update(index, { id: event.target.value })}
                  />
                </Field>
                <Field label="الأيقونة" htmlFor={`icon-${index}`}>
                  <SelectInput
                    id={`icon-${index}`}
                    value={field.icon}
                    onChange={(event) =>
                      update(index, { icon: event.target.value as FieldsContent[number]["icon"] })
                    }
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="اللون" htmlFor={`color-${index}`}>
                  <SelectInput
                    id={`color-${index}`}
                    value={
                      colorOptions.some((option) => option.value === field.color)
                        ? field.color
                        : colorOptions[0].value
                    }
                    onChange={(event) => update(index, { color: event.target.value })}
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <LocalizedField
                  label="العنوان"
                  rows={1}
                  value={field.title}
                  onChange={(next) => update(index, { title: next })}
                />
                <LocalizedField
                  label="الوصف"
                  value={field.description}
                  onChange={(next) => update(index, { description: next })}
                />
              </div>
            </Card>
          ))}

          <button
            type="button"
            onClick={() => setData([...fields, emptyField()])}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            إضافة مجال
          </button>

          <SaveBar status={status} error={error} dirty={dirty} onSave={() => void save(fields)} />
        </div>
      )}
    </div>
  )
}
