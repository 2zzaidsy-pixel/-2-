import { readFile, writeFile } from "@/lib/admin/github"
import { identityKeys, type IdentityValues } from "@/lib/admin/identity"
import type { Locale } from "@/lib/i18n"

export { identityKeys }
export type { IdentityKey, IdentityValues } from "@/lib/admin/identity"

function messagesPath(locale: Locale): string {
  return `src/messages/${locale}.json`
}

export async function readIdentity(locale: Locale): Promise<IdentityValues> {
  const file = await readFile(messagesPath(locale))
  const all: Record<string, unknown> = file ? JSON.parse(file.content) : {}
  const values = {} as IdentityValues
  for (const key of identityKeys) {
    values[key] = typeof all[key] === "string" ? (all[key] as string) : ""
  }
  return values
}

export async function writeIdentity(
  locale: Locale,
  values: Partial<IdentityValues>
): Promise<void> {
  const file = await readFile(messagesPath(locale))
  if (!file) throw new Error(`Unable to load ${messagesPath(locale)} from the repository.`)

  const all: Record<string, unknown> = JSON.parse(file.content)
  for (const key of identityKeys) {
    const value = values[key]
    if (typeof value === "string") all[key] = value
  }

  const serialized = `${JSON.stringify(all, null, 2)}\n`
  await writeFile(
    messagesPath(locale),
    serialized,
    `chore(admin): update ${locale} identity`,
    file.sha
  )
}
