import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Cairo } from "next/font/google"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import "../globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "لوحة التحكم",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "dark light",
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable}`}
    >
      <body className="min-h-svh bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
