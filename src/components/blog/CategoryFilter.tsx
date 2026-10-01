"use client"

import { cn } from "@/lib/utils"

export interface CategoryOption {
  value: string
  label: string
}

interface CategoryFilterProps {
  categories: CategoryOption[]
  selected: string | null
  onSelect: (category: string | null) => void
  allLabel: string
  groupLabel: string
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  allLabel,
  groupLabel,
}: CategoryFilterProps) {
  const buttonClass = (isActive: boolean) =>
    cn(
      "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
      isActive
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border/60 bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
    )

  return (
    <div role="group" aria-label={groupLabel} className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={selected === null}
        className={buttonClass(selected === null)}
      >
        {allLabel}
      </button>
      {categories.map((category) => (
        <button
          key={category.value}
          type="button"
          onClick={() => onSelect(category.value === selected ? null : category.value)}
          aria-pressed={selected === category.value}
          className={buttonClass(selected === category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
