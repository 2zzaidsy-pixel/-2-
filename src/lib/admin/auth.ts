import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import {
  createSessionToken,
  sessionCookie,
  sessionMaxAgeSeconds,
  verifySessionToken,
  type AdminSession,
} from "@/lib/admin/session"

const isProduction = process.env.NODE_ENV === "production"

export function verifyPassword(password: string): boolean {
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (!hash) return false
  return bcrypt.compareSync(password, hash)
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies()
  return verifySessionToken(store.get(sessionCookie)?.value)
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null
}

/**
 * Guards a route handler. Returns a 401 response when there is no valid
 * session, otherwise null so the caller can continue.
 */
export async function guardRequest(): Promise<Response | null> {
  if (await isAuthenticated()) return null
  return Response.json({ error: "unauthorized" }, { status: 401 })
}

/**
 * Rejects cross-site writes. Browsers send `Origin` on same-origin fetches, so
 * a mismatch with the request host means the call did not come from our admin
 * UI and must not mutate content.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true
  try {
    return new URL(origin).host === request.headers.get("host")
  } catch {
    return false
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  }
}

export { createSessionToken, sessionCookie }
