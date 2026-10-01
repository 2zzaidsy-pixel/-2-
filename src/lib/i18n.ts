import ar from "@/messages/ar.json"
import en from "@/messages/en.json"

export const locales = ["en", "ar"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeCookie = "NEXT_LOCALE"

export const localeDir: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
}

export const localeLabel: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
}

export const localeDateTag: Record<Locale, string> = {
  en: "en-US",
  ar: "ar-EG",
}

export const localeNumberTag: Record<Locale, string> = {
  en: "en-US",
  ar: "ar-EG",
}

export const localeOgLocale: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_EG",
}

export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value)
}

export interface Localized {
  en: string
  ar: string
}

export function localize(value: Localized, locale: Locale): string {
  return value[locale] ?? value.en
}

type MessageTable = typeof en

export type Messages = MessageTable
export type MessageKey = keyof MessageTable

const tables: Record<Locale, Messages> = { en, ar }

export function getMessages(locale: Locale): Messages {
  return tables[locale] ?? tables[defaultLocale]
}

export type Translator = (key: MessageKey) => string

export function createTranslator(locale: Locale): Translator {
  const messages = getMessages(locale)
  return (key) => messages[key] ?? en[key] ?? key
}

export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeDateTag[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date))
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeNumberTag[locale]).format(value)
}

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other"

/** Arabic keeps six plural categories; English only needs one/other. */
export function pluralCategory(count: number, locale: Locale): PluralCategory {
  if (count === 0) return "zero"
  if (locale === "en") return count === 1 ? "one" : "other"
  if (count === 1) return "one"
  if (count === 2) return "two"

  const mod100 = count % 100
  if (mod100 >= 3 && mod100 <= 10) return "few"
  if (mod100 >= 11 && mod100 <= 99) return "many"
  return "other"
}

export type PluralKey = "blog.readingTime" | "blog.resultsCount" | "content.statFollowers"

export function plural(key: PluralKey, count: number, locale: Locale): string {
  const messages = getMessages(locale) as unknown as Record<string, string>
  const category = pluralCategory(count, locale)
  const template =
    messages[`${key}.${category}`] ?? messages[`${key}.other`] ?? messages[key] ?? ""

  return template.replace("{n}", formatNumber(count, locale))
}

export function swapLocaleInPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  if (isLocale(segments[0])) {
    segments[0] = segments[0] === "en" ? "ar" : "en"
    return `/${segments.join("/")}`
  }
  return pathname
}

/**
 * Target of the header language switch. Article slugs are language-specific
 * with no translated pairs, so switching from an article lands on that
 * language's blog index instead of a slug that would 404.
 */
export function languageSwitchHref(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean)
  const isArticlePage = isLocale(segments[0]) && segments[1] === "blog" && segments.length === 3
  const other: Locale = locale === "en" ? "ar" : "en"

  return isArticlePage ? `/${other}/blog` : swapLocaleInPath(pathname)
}
