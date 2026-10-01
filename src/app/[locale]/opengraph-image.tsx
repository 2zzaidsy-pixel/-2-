import { ImageResponse } from "next/og"
import { siteConfig } from "@/data/site"
import { getMessages, isLocale, defaultLocale } from "@/lib/i18n"

export const alt = "Zaid — Think clearly. Build honestly."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : defaultLocale
  const t = getMessages(locale)
  const isArabic = locale === "ar"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #5b3df5 0%, #4338ca 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Z
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 600 }}>{t["site.name"]}</div>
            <div style={{ fontSize: 22, color: "#a1a1aa" }}>{t["site.role"]}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: isArabic ? 58 : 68,
              fontWeight: 700,
              lineHeight: 1.15,
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {t["site.tagline"]}
          </div>
          <div style={{ fontSize: 30, color: "#d4d4d8" }}>{t["hero.badge"]}</div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa" }}>{siteConfig.url}</div>
      </div>
    ),
    size
  )
}
