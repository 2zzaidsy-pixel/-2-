"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import {
  Card,
  Field,
  IconBtn,
  LocalizedField,
  PageIntro,
  TextInput,
} from "@/components/admin/form"
import { SaveBar } from "@/components/admin/SaveBar"
import { useResource } from "@/components/admin/useResource"
import type { PhilosophyContent } from "@/lib/admin/schemas"

function emptyQuote(): PhilosophyContent["philosophies"][number] {
  return {
    id: `quote-${Date.now().toString(36)}`,
    quote: { en: "", ar: "" },
    author: { en: "", ar: "" },
    context: { en: "", ar: "" },
  }
}

export function PhilosophyEditor() {
  const { data, setData, status, error, save, dirty } = useResource<PhilosophyContent>("philosophy")
  const quotes = data?.philosophies ?? []
  const statement = data?.personalPhilosophy?.statement ?? { en: "", ar: "" }

  function updateQuote(index: number, next: Partial<PhilosophyContent["philosophies"][number]>) {
    setData({
      ...data!,
      philosophies: quotes.map((item, i) => (i === index ? { ...item, ...next } : item)),
    })
  }

  function removeQuote(index: number) {
    setData({ ...data!, philosophies: quotes.filter((_, i) => i !== index) })
  }

  function moveQuote(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= quotes.length) return
    const copy = [...quotes]
    const [moved] = copy.splice(index, 1)
    copy.splice(target, 0, moved)
    setData({ ...data!, philosophies: copy })
  }

  function addQuote() {
    setData({ ...data!, philosophies: [...quotes, emptyQuote()] })
  }

  function updateStatement(next: { en: string; ar: string }) {
    setData({ ...data!, personalPhilosophy: { statement: next } })
  }

  return (
    <div>
      <PageIntro
        title="الفلسفة"
        description="اقتباسات التي تظهر في قسم «كيف أفكّر»، بالإضافة إلى عبارتك الشخصية."
      />

      {data === null && status === "error" ? (
        <Card title="تعذّر التحميل">{error}</Card>
      ) : data === null ? (
        <Card>جارٍ التحميل…</Card>
      ) : (
        <div className="flex flex-col gap-6">
          <Card title="العبارة الشخصية" description="الفقرة التعريفية التي تفتح قسم الفلسفة.">
            <LocalizedField label="العبارة" value={statement} onChange={updateStatement} />
          </Card>

          {quotes.map((item, index) => (
            <Card key={index} title={item.quote.en || item.quote.ar || "اقتباس جديد"}>
              <div className="mb-4 flex items-center justify-end gap-1">
                <IconBtn label="تحريك لأعلى" disabled={index === 0} onClick={() => moveQuote(index, -1)}>
                  <ChevronUp className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  label="تحريك لأسفل"
                  disabled={index === quotes.length - 1}
                  onClick={() => moveQuote(index, 1)}
                >
                  <ChevronDown className="h-4 w-4" />
                </IconBtn>
                <IconBtn label="حذف" danger onClick={() => removeQuote(index)}>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>

              <div className="flex flex-col gap-4">
                <Field label="المعرّف (id)" htmlFor={`id-${index}`}>
                  <TextInput
                    id={`id-${index}`}
                    dir="ltr"
                    value={item.id}
                    onChange={(event) => updateQuote(index, { id: event.target.value })}
                  />
                </Field>
                <LocalizedField
                  label="الاقتباس"
                  value={item.quote}
                  onChange={(next) => updateQuote(index, { quote: next })}
                />
                <LocalizedField
                  label="الناقل"
                  rows={1}
                  value={item.author}
                  onChange={(next) => updateQuote(index, { author: next })}
                />
                <LocalizedField
                  label="السياق / الشرح"
                  value={item.context}
                  onChange={(next) => updateQuote(index, { context: next })}
                />
              </div>
            </Card>
          ))}

          <button
            type="button"
            onClick={addQuote}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            إضافة اقتباس
          </button>

          <SaveBar status={status} error={error} dirty={dirty} onSave={() => void save(data)} />
        </div>
      )}
    </div>
  )
}
