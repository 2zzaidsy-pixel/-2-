import { guardRequest, isSameOrigin } from "@/lib/admin/auth"
import { readResource, writeResource } from "@/lib/admin/content"
import { errorResponse } from "@/lib/admin/http"
import { readIdentity, writeIdentity, type IdentityValues } from "@/lib/admin/messages"
import { siteSchema } from "@/lib/admin/schemas"
import { locales, type Locale } from "@/lib/i18n"

export const runtime = "nodejs"

interface SitePayload {
  site: unknown
  messages: Partial<Record<Locale, Partial<IdentityValues>>>
}

export async function GET() {
  const guard = await guardRequest()
  if (guard) return guard

  try {
    const site = await readResource("site")
    const messages = Object.fromEntries(
      await Promise.all(locales.map(async (locale) => [locale, await readIdentity(locale)]))
    )
    return Response.json({ site, messages })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(request: Request) {
  const guard = await guardRequest()
  if (guard) return guard
  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 })
  }

  try {
    const body = (await request.json()) as SitePayload
    const site = siteSchema.parse(body.site)
    await writeResource("site", site)
    await Promise.all(
      locales.map((locale) => writeIdentity(locale, body.messages?.[locale] ?? {}))
    )
    return Response.json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
