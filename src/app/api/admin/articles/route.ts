import { z } from "zod"
import { guardRequest, isSameOrigin } from "@/lib/admin/auth"
import { createArticle, listArticles } from "@/lib/admin/articles"
import { errorResponse } from "@/lib/admin/http"
import { articleWriteSchema } from "@/lib/admin/schemas"

export const runtime = "nodejs"

const localeQuery = z.enum(["en", "ar"])

export async function GET(request: Request) {
  const guard = await guardRequest()
  if (guard) return guard

  const url = new URL(request.url)
  const locale = localeQuery.safeParse(url.searchParams.get("locale"))
  if (!locale.success) {
    return Response.json({ error: "invalid-locale" }, { status: 400 })
  }

  try {
    const articles = await listArticles(locale.data)
    return Response.json({ articles })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request) {
  const guard = await guardRequest()
  if (guard) return guard
  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 })
  }

  try {
    const body = articleWriteSchema.parse(await request.json())
    await createArticle({
      locale: body.locale,
      slug: body.slug,
      frontmatter: body.frontmatter,
      content: body.content,
    })
    return Response.json({ ok: true, slug: body.slug })
  } catch (error) {
    return errorResponse(error)
  }
}
