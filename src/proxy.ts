import { NextResponse, type NextRequest } from "next/server"
import { defaultLocale, isLocale, localeCookie } from "@/lib/i18n"

const passthroughPrefixes = [
  "/_next",
  "/api",
  "/opengraph-image",
  "/twitter-image",
  "/icon",
  "/apple-icon",
  "/sitemap",
  "/robots",
  "/manifest",
  "/favicon",
]

function hasFileExtension(pathname: string): boolean {
  const last = pathname.split("/").pop() ?? ""
  return last.includes(".")
}

function preferredLocale(request: NextRequest) {
  const cookie = request.cookies.get(localeCookie)?.value
  if (isLocale(cookie)) return cookie

  const header = request.headers.get("accept-language")
  if (!header) return defaultLocale

  const accepted = header
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=")
      return { tag: tag.toLowerCase(), quality: quality ? Number(quality) : 1 }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { tag } of accepted) {
    const base = tag.split("-")[0]
    if (isLocale(base)) return base
  }

  return defaultLocale
}

/**
 * A bare language code that this site does not serve. `/fr/...` must not be
 * rewritten to `/en/fr/...`: that reads as a nested path and returns a 404
 * that looks like a broken link. Letting the request through produces a clean
 * not-found instead.
 */
function isUnsupportedLocaleSegment(segment: string | undefined): boolean {
  if (segment === undefined) return false
  const base = segment.split("-")[0].toLowerCase()
  return /^[a-z]{2,3}$/.test(base) && !isLocale(base)
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    passthroughPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    hasFileExtension(pathname)
  ) {
    return NextResponse.next()
  }

  const first = pathname.split("/").filter(Boolean)[0]

  if (isLocale(first)) {
    const response = NextResponse.next()
    response.cookies.set(localeCookie, first, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
    return response
  }

  if (isUnsupportedLocaleSegment(first)) return NextResponse.next()

  const locale = preferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}
