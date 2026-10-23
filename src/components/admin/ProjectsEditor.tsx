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
  StringListEditor,
  TextInput,
} from "@/components/admin/form"
import { SaveBar } from "@/components/admin/SaveBar"
import { useResource } from "@/components/admin/useResource"
import type { ProjectsContent } from "@/lib/admin/schemas"

const gradientOptions = [
  { value: "from-indigo-500 via-violet-500 to-fuchsia-500", label: "بنفسجي" },
  { value: "from-emerald-500 via-teal-500 to-cyan-500", label: "أخضر" },
  { value: "from-rose-500 via-pink-500 to-orange-500", label: "وردي" },
  { value: "from-amber-500 via-orange-500 to-red-500", label: "كهرماني" },
  { value: "from-sky-500 via-blue-500 to-indigo-500", label: "أزرق" },
]

function emptyProject(): ProjectsContent[number] {
  return {
    id: `project-${Date.now().toString(36)}`,
    name: "",
    url: "https://",
    monogram: "",
    gradient: gradientOptions[0].value,
    status: "live",
    category: { en: "", ar: "" },
    description: { en: "", ar: "" },
    highlights: { en: [], ar: [] },
  }
}

export function ProjectsEditor() {
  const { data, setData, status, error, save, dirty } = useResource<ProjectsContent>("projects")
  const projects = data ?? []

  function update(index: number, next: Partial<ProjectsContent[number]>) {
    setData(projects.map((project, i) => (i === index ? { ...project, ...next } : project)))
  }

  function remove(index: number) {
    setData(projects.filter((_, i) => i !== index))
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= projects.length) return
    const copy = [...projects]
    const [moved] = copy.splice(index, 1)
    copy.splice(target, 0, moved)
    setData(copy)
  }

  return (
    <div>
      <PageIntro
        title="المشاريع"
        description="حدّث المشاريع الظاهرة في الصفحة الرئيسية وفي صفحة المشاريع. كل مشروع يحتاج معرّفًا فريدًا وأيقونة مختصرة."
      />

      {data === null && status === "error" ? (
        <Card title="تعذّر التحميل">{error}</Card>
      ) : data === null ? (
        <Card>جارٍ التحميل…</Card>
      ) : (
        <div className="flex flex-col gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              title={
                <span className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full bg-gradient-to-br ${project.gradient}`} />
                  {project.name || "مشروع جديد"}
                </span>
              }
              description={project.url}
            >
              <div className="mb-4 flex items-center justify-end gap-1">
                <IconBtn label="تحريك لأعلى" disabled={index === 0} onClick={() => move(index, -1)}>
                  <ChevronUp className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  label="تحريك لأسفل"
                  disabled={index === projects.length - 1}
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
                    value={project.name}
                    onChange={(event) => update(index, { name: event.target.value })}
                  />
                </Field>
                <Field label="المعرّف (id)" htmlFor={`id-${index}`} hint="حروف لاتينية صغيرة وأرقام وشرطة فقط">
                  <TextInput
                    id={`id-${index}`}
                    dir="ltr"
                    value={project.id}
                    onChange={(event) => update(index, { id: event.target.value })}
                  />
                </Field>
                <Field label="الرابط" htmlFor={`url-${index}`}>
                  <TextInput
                    id={`url-${index}`}
                    dir="ltr"
                    type="url"
                    value={project.url}
                    onChange={(event) => update(index, { url: event.target.value })}
                  />
                </Field>
                <Field label="الأيقونة المختصرة" htmlFor={`monogram-${index}`}>
                  <TextInput
                    id={`monogram-${index}`}
                    dir="ltr"
                    maxLength={4}
                    value={project.monogram}
                    onChange={(event) => update(index, { monogram: event.target.value })}
                  />
                </Field>
                <Field label="التدرج اللوني" htmlFor={`gradient-${index}`}>
                  <SelectInput
                    id={`gradient-${index}`}
                    value={
                      gradientOptions.some((option) => option.value === project.gradient)
                        ? project.gradient
                        : gradientOptions[0].value
                    }
                    onChange={(event) => update(index, { gradient: event.target.value })}
                  >
                    {gradientOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <LocalizedField
                  label="التصنيف"
                  value={project.category}
                  rows={1}
                  onChange={(next) => update(index, { category: next })}
                />
                <LocalizedField
                  label="الوصف"
                  value={project.description}
                  onChange={(next) => update(index, { description: next })}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <StringListEditor
                    label="أبرز المزايا (إنجليزي)"
                    items={project.highlights.en}
                    onChange={(en) =>
                      update(index, { highlights: { ...project.highlights, en } })
                    }
                  />
                  <StringListEditor
                    label="أبرز المزايا (عربي)"
                    items={project.highlights.ar}
                    onChange={(ar) =>
                      update(index, { highlights: { ...project.highlights, ar } })
                    }
                  />
                </div>
              </div>
            </Card>
          ))}

          <button
            type="button"
            onClick={() => setData([...projects, emptyProject()])}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            إضافة مشروع
          </button>

          <SaveBar status={status} error={error} dirty={dirty} onSave={() => void save(projects)} />
        </div>
      )}
    </div>
  )
}
