import { guardRequest, isSameOrigin } from "@/lib/admin/auth"
import { isResourceName, readResource, writeResource } from "@/lib/admin/content"
import { errorResponse } from "@/lib/admin/http"

export const runtime = "nodejs"

interface RouteContext {
  params: Promise<{ resource: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const guard = await guardRequest()
  if (guard) return guard

  const { resource } = await context.params
  if (!isResourceName(resource)) {
    return Response.json({ error: "unknown-resource" }, { status: 404 })
  }

  try {
    const data = await readResource(resource)
    return Response.json({ data })
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

  const { resource } = await context.params
  if (!isResourceName(resource)) {
    return Response.json({ error: "unknown-resource" }, { status: 404 })
  }

  try {
    const body = (await request.json()) as unknown
    const data = await writeResource(resource, body)
    return Response.json({ ok: true, data })
  } catch (error) {
    return errorResponse(error)
  }
}
