import { NextResponse } from "next/server"
import { isSameOrigin, sessionCookie } from "@/lib/admin/auth"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(sessionCookie, "", { path: "/", maxAge: 0 })
  return response
}
