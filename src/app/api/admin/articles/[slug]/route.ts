import { z } from "zod"
import { guardRequest, isSameOrigin } from "@/lib/admin/auth"
import { deleteArticle, getArticle, updateArticle } from "@/lib/admin/articles"
import { errorResponse } from "@/lib/admin/http"
import { articleWriteSchema } from "@/lib/admin/schemas"

export const runtime = "nodejs"

const localeQuery = z.enum(["en", "ar"])

interface RouteContext {
  params: Promise<{ slug: string }>
}

function readLocale(request: Request): z.infer<typeof localeQuery> | null {
  const url = new URL(request.url)
  const result = localeQuery.safeParse(url.searchParams.get("locale"))
  return result.success ? result.data : null
}

export async function GET(request: Request, context: RouteContext) {
  const guard = await guardRequest()
  if (guard) return guard

  const locale = readLocale(request)
  if (!locale) return Response.json({ error: "invalid-locale" }, { status: 400 })

  const { slug } = await context.params
  try {
    const article = await getArticle(locale, slug)
    if (!article) return Response.json({ error: "not-found" }, { status: 404 })
    return Response.json({ article })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const guard = await guardRequest()
  if (guard) return guard
  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 })
  }

  const { slug } = await context.params
  try {
    const body = articleWriteSchema.parse(await request.json())
    await updateArticle({
      locale: body.locale,
      slug: body.slug,
      renameFrom: slug,
      frontmatter: body.frontmatter,
      content: body.content,
    })
    return Response.json({ ok: true, slug: body.slug })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const guard = await guardRequest()
  if (guard) return guard
  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 })
  }

  const locale = readLocale(request)
  if (!locale) return Response.json({ error: "invalid-locale" }, { status: 400 })

  const { slug } = await context.params
  try {
    await deleteArticle({ locale, slug })
    return Response.json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
