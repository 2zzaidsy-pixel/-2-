export const identityKeys = [
  "site.name",
  "site.tagline",
  "site.description",
  "site.role",
  "site.bio",
  "site.portraitAlt",
] as const

export type IdentityKey = (typeof identityKeys)[number]

export type IdentityValues = Record<IdentityKey, string>
