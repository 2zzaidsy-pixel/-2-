import { readFile, writeFile, deleteFile } from "@/lib/admin/github"
import {
  fieldsSchema,
  philosophySchema,
  projectsSchema,
  siteSchema,
  socialSchema,
} from "@/lib/admin/schemas"
import type { z } from "zod"

export const resources = {
  site: { path: "src/content/site.json", schema: siteSchema },
  social: { path: "src/content/social.json", schema: socialSchema },
  projects: { path: "src/content/projects.json", schema: projectsSchema },
  fields: { path: "src/content/fields.json", schema: fieldsSchema },
  philosophy: { path: "src/content/philosophy.json", schema: philosophySchema },
} as const

export type ResourceName = keyof typeof resources

export function isResourceName(value: string): value is ResourceName {
  return Object.prototype.hasOwnProperty.call(resources, value)
}

export async function readResource(name: ResourceName): Promise<unknown | null> {
  const file = await readFile(resources[name].path)
  if (!file) return null
  return JSON.parse(file.content) as unknown
}

export async function writeResource(
  name: ResourceName,
  value: unknown
): Promise<z.infer<(typeof resources)[ResourceName]["schema"]>> {
  const resource = resources[name]
  const parsed = resource.schema.parse(value)
  const existing = await readFile(resource.path)
  const serialized = `${JSON.stringify(parsed, null, 2)}\n`
  await writeFile(
    resource.path,
    serialized,
    `chore(admin): update ${name}`,
    existing?.sha
  )
  return parsed
}

export async function deleteResourceFile(name: ResourceName): Promise<boolean> {
  const resource = resources[name]
  const existing = await readFile(resource.path)
  if (!existing) return false
  await deleteFile(resource.path, `chore(admin): delete ${name}`, existing.sha)
  return true
}
