"use client"

import * as React from "react"
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function Card({
  title,
  description,
  children,
  className,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-xl border border-border/60 bg-card p-5 sm:p-6", className)}>
      {(title || description) && (
        <header className="mb-5">
          {title && <h2 className="text-base font-semibold">{title}</h2>}
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </header>
      )}
      {children}
    </section>
  )
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: React.ReactNode
  hint?: React.ReactNode
  htmlFor?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

const controlClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-primary placeholder:text-muted-foreground/70"

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlClass, className)} />
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(controlClass, "min-h-[90px] resize-y leading-relaxed", className)}
    />
  )
}

export function SelectInput({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(controlClass, "cursor-pointer", className)}>
      {children}
    </select>
  )
}

/** English and Arabic textareas side by side for a `Localized` value. */
export function LocalizedField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: React.ReactNode
  value: { en: string; ar: string }
  onChange: (next: { en: string; ar: string }) => void
  rows?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block text-xs text-muted-foreground">English</span>
          <textarea
            dir="ltr"
            rows={rows}
            value={value.en}
            onChange={(event) => onChange({ ...value, en: event.target.value })}
            className={cn(controlClass, "min-h-[70px] resize-y leading-relaxed")}
          />
        </div>
        <div>
          <span className="mb-1 block text-xs text-muted-foreground">العربية</span>
          <textarea
            dir="rtl"
            rows={rows}
            value={value.ar}
            onChange={(event) => onChange({ ...value, ar: event.target.value })}
            className={cn(controlClass, "min-h-[70px] resize-y leading-relaxed")}
          />
        </div>
      </div>
    </div>
  )
}

/** Reorderable list of plain strings (e.g. project highlights). */
export function StringListEditor({
  label,
  items,
  onChange,
  addButton = "إضافة",
  placeholder,
}: {
  label: React.ReactNode
  items: string[]
  onChange: (next: string[]) => void
  addButton?: string
  placeholder?: string
}) {
  function update(index: number, next: string) {
    onChange(items.map((item, i) => (i === index ? next : item)))
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const copy = [...items]
    const [moved] = copy.splice(index, 1)
    copy.splice(target, 0, moved)
    onChange(copy)
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <textarea
              dir="ltr"
              rows={2}
              value={item}
              placeholder={placeholder}
              onChange={(event) => update(index, event.target.value)}
              className={cn(controlClass, "min-h-[44px] flex-1 resize-y")}
            />
            <div className="flex flex-col gap-1">
              <button
                type="button"
                aria-label="تحريك لأعلى"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-foreground/5 disabled:opacity-40"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="تحريك لأسفل"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-foreground/5 disabled:opacity-40"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="حذف"
                onClick={() => remove(index)}
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        {addButton}
      </button>
    </div>
  )
}

export function PageIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

export function IconBtn({
  label,
  disabled,
  danger,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  danger?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-foreground/5 disabled:opacity-40",
        danger && "hover:bg-destructive/10 hover:text-destructive"
      )}
    >
      {children}
    </button>
  )
}
