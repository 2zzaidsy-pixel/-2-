"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: string[]
  selected: string | null
  onSelect: (category: string | null) => void
  allLabel?: string
}

export function CategoryFilter({ categories, selected, onSelect, allLabel = "All" }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
          selected === null
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground"
        )}
      >
        {allLabel}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat === selected ? null : cat)}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
            selected === cat
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
