import { SignJWT, jwtVerify } from "jose"

export const sessionCookie = "admin_session"

export const sessionMaxAgeSeconds = 60 * 60 * 24 * 7

const algorithm = "HS256"

export interface AdminSession {
  role: "admin"
}

function secretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or shorter than 32 characters. Set it in the environment."
    )
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" } satisfies AdminSession)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(`${sessionMaxAgeSeconds}s`)
    .sign(secretKey())
}

export async function verifySessionToken(
  token: string | undefined
): Promise<AdminSession | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey())
    return payload.role === "admin" ? { role: "admin" } : null
  } catch {
    return null
  }
}
