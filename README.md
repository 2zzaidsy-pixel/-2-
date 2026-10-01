# Zaid — personal site

Bilingual (`/en`, `/ar`) personal site: builder profile, live projects, and long-form writing.
Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, and TypeScript.

## Stack notes

- No i18n library. Routing is handled by `src/proxy.ts`, which redirects any non-localized
  path to a locale prefix (`/en/...`, `/ar/...`) based on the `NEXT_LOCALE` cookie or
  `Accept-Language`, then stores the choice in a cookie.
- `<html lang dir>` is set per locale; Arabic renders RTL with a dedicated font.
- Articles are plain Markdown with `gray-matter` frontmatter, read from
  `src/content/articles/<locale>/*.md`. Slugs must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`,
  so Arabic articles use ASCII slugs while their content is Arabic.
- Articles render on the server (no client Markdown bundle). Client components are limited to
  interactive pieces: theme toggle, mobile nav, search, and category filter.

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

> On Windows, if the project folder name contains non-ASCII characters (e.g. Arabic),
> `next build` (Turbopack) can fail with an internal `char boundary` panic that is unrelated
> to the code. Use `npx next build --webpack` in that case.

## Content

- Site identity, email, and social links: `src/data/site.ts`
- Social platform stats: `src/data/social.ts` (`followers: null` hides the number)
- Projects: `src/data/projects.ts`
- UI copy: `src/messages/en.json` and `src/messages/ar.json` (flat, dot-separated keys)

## Environment

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the canonical domain.
It is used for canonical URLs, `hreflang`, sitemap, robots, and Open Graph images.

## SEO

Per-locale metadata, canonical + `hreflang` alternates, dynamic OG image
(`src/app/[locale]/opengraph-image.tsx`), `sitemap.xml`, `robots.txt`, `manifest.webmanifest`,
JSON-LD (`Person` on every page, `Article` on posts), and security headers in `next.config.ts`.
