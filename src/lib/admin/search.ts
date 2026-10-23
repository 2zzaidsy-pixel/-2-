import { isLocale, type Locale } from "@/lib/i18n"

/** Reads a validated locale from `searchParams`, falling back when missing/invalid. */
export function localeFromSearchParams(
  value: string | string[] | undefined,
  fallback: Locale = "ar"
): Locale {
  const raw = Array.isArray(value) ? value[0] : value
  return isLocale(raw) ? raw : fallback
}
