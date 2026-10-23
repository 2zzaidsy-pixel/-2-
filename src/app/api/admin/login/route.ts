import { NextResponse } from "next/server"
import {
  createSessionToken,
  isSameOrigin,
  sessionCookie,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/admin/auth"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  let password: unknown
  try {
    ;({ password } = (await request.json()) as { password?: unknown })
  } catch {
    return NextResponse.json({ error: "invalid-body" }, { status: 400 })
  }

  if (typeof password !== "string" || !verifyPassword(password)) {
    return NextResponse.json({ error: "invalid-credentials" }, { status: 401 })
  }

  const token = await createSessionToken()
  const response = NextResponse.json({ ok: true })
  response.cookies.set(sessionCookie, token, sessionCookieOptions())
  return response
}
