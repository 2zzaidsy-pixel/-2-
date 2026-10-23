import { guardRequest, isSameOrigin } from "@/lib/admin/auth"
import { writeBinaryFile } from "@/lib/admin/github"

export const runtime = "nodejs"

const maxBytes = 4 * 1024 * 1024

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
}

export async function POST(request: Request) {
  const guard = await guardRequest()
  if (guard) return guard
  if (!isSameOrigin(request)) {
    return Response.json({ error: "forbidden" }, { status: 403 })
  }

  try {
    const form = await request.formData()
    const file = form.get("file")

    if (!(file instanceof File)) {
      return Response.json({ error: "invalid-file" }, { status: 400 })
    }
    if (!Object.prototype.hasOwnProperty.call(extensions, file.type)) {
      return Response.json({ error: "unsupported-type" }, { status: 400 })
    }
    if (file.size > maxBytes) {
      return Response.json({ error: "too-large" }, { status: 400 })
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64")
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensions[file.type]}`
    const repoPath = `public/images/uploads/${name}`

    await writeBinaryFile(repoPath, base64, `chore(admin): upload ${name}`)

    const url = `/${repoPath.replace(/^public\//, "")}`
    return Response.json({ ok: true, url })
  } catch (error) {
    console.error("[admin:upload]", error)
    const message = error instanceof Error ? error.message : "upload failed"
    return Response.json({ error: "server", message }, { status: 500 })
  }
}
