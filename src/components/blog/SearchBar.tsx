"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
  clearLabel: string
}

export function SearchBar({ value, onChange, placeholder, label, clearLabel }: SearchBarProps) {
  const id = React.useId()

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search aria-hidden className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-11 w-full rounded-xl border border-border/60 bg-background ps-10 pe-9",
          "text-sm text-foreground placeholder:text-muted-foreground",
          "transition-all duration-200 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30",
          // Hide WebKit's native clear control; the custom button below replaces it.
          "[&::-webkit-search-cancel-button]:appearance-none"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={clearLabel}
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
