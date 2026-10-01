import type { Components } from "react-markdown"
import Image from "next/image"
import { createSlugger } from "@/lib/slug"

export interface TocItem {
  id: string
  text: string
  level: number
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_~]/g, "")
    .trim()
}

export function generateTableOfContents(markdown: string): TocItem[] {
  const slug = createSlugger()
  const items: TocItem[] = []
  let inFence = false

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue

    const text = stripInlineMarkdown(match[2])
    if (!text) continue

    items.push({ id: slug(text), text, level: match[1].length })
  }

  return items
}

type HastNode = {
  type: string
  tagName?: string
  value?: unknown
  properties?: Record<string, unknown>
  children?: HastNode[]
}

function headingText(node: HastNode): string {
  if (node.type === "text") return typeof node.value === "string" ? node.value : ""
  return (node.children ?? []).map(headingText).join("")
}

export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    const slug = createSlugger()
    const walk = (node: HastNode) => {
      if (node.tagName && /^h[1-4]$/.test(node.tagName)) {
        const text = headingText(node).trim()
        if (text) {
          node.properties = { ...node.properties, id: slug(text) }
        }
      }
      node.children?.forEach(walk)
    }
    walk(tree)
  }
}

export const markdownComponents: Partial<Components> = {
  h1: ({ id, children, ...props }) => (
    <h1 id={id} className="scroll-mt-28" {...props}>
      {children}
    </h1>
  ),
  h2: ({ id, children, ...props }) => (
    <h2 id={id} className="scroll-mt-28" {...props}>
      {children}
    </h2>
  ),
  h3: ({ id, children, ...props }) => (
    <h3 id={id} className="scroll-mt-28" {...props}>
      {children}
    </h3>
  ),
  h4: ({ id, children, ...props }) => (
    <h4 id={id} className="scroll-mt-28" {...props}>
      {children}
    </h4>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = typeof href === "string" && /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    )
  },
  img: ({ src, alt }) => {
    if (typeof src !== "string" || !src) return null
    return (
      <Image
        src={src}
        alt={alt ?? ""}
        width={1200}
        height={675}
        sizes="(max-width: 768px) 100vw, 720px"
      />
    )
  },
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto">
      <table {...props}>{children}</table>
    </div>
  ),
  pre: ({ children, ...props }) => <pre {...props}>{children}</pre>,
}
