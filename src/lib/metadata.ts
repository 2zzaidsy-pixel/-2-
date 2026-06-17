import type { Metadata } from "next"
import { siteConfig } from "@/data/site"

export function constructMetadata({
  title,
  description,
  path,
  image,
}: {
  title?: string
  description?: string
  path?: string
  image?: string
} = {}): Metadata {
  return {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description: description ?? siteConfig.description,
    openGraph: {
      title: title ?? siteConfig.title,
      description: description ?? siteConfig.description,
      url: path ? `${siteConfig.url}${path}` : siteConfig.url,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? siteConfig.title,
      description: description ?? siteConfig.description,
      images: [image ?? siteConfig.ogImage],
      creator: "@",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: path ? `${siteConfig.url}${path}` : siteConfig.url,
    },
  }
}
