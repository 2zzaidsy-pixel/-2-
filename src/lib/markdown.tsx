import type { Components } from "react-markdown"
import React from "react"

export function generateTableOfContents(markdown: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const toc: { id: string; text: string; level: number }[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].replace(/[`*_~]/g, "").trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
    toc.push({ id, text, level })
  }

  return toc
}

export const markdownComponents: Partial<Components> = {
  pre: ({ children, ...props }) => (
    <div className="relative group">
      <pre
        className="overflow-x-auto rounded-xl border border-border/50 bg-zinc-950 p-4 text-sm leading-relaxed dark:bg-zinc-900"
        {...props}
      >
        {children}
      </pre>
    </div>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code
          className="rounded-md bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground"
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ""}
      className="rounded-xl w-full object-cover my-8"
      loading="lazy"
    />
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary/30 pl-6 my-6 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-border/50" />,
  ul: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>,
  li: ({ children }) => <li className="text-muted-foreground leading-relaxed">{children}</li>,
  h1: ({ children, ...props }) => {
    const id = String(children).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
    return <h1 id={id} className="text-3xl font-bold tracking-tight mt-12 mb-4" {...props}>{children}</h1>
  },
  h2: ({ children, ...props }) => {
    const id = String(children).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
    return <h2 id={id} className="text-2xl font-bold tracking-tight mt-10 mb-3" {...props}>{children}</h2>
  },
  h3: ({ children, ...props }) => {
    const id = String(children).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
    return <h3 id={id} className="text-xl font-semibold tracking-tight mt-8 mb-2" {...props}>{children}</h3>
  },
  p: ({ children }) => <p className="text-muted-foreground leading-relaxed my-4">{children}</p>,
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-border/50 px-4 py-2 text-left font-medium bg-muted/50">{children}</th>,
  td: ({ children }) => <td className="border border-border/50 px-4 py-2 text-muted-foreground">{children}</td>,
}
