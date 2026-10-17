import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { WEBSITE_URL } from "@/lib/constants"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"
import { SiteFrame } from "@/components/redesign/site-frame"
import { BOOT_SCRIPT } from "@/lib/redesign/boot-script"
import { personJsonLd, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/redesign/meta"
import { getRequestLanguage } from "@/lib/redesign/request-language"

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.replace(
  /^google-site-verification=/,
  "",
).trim()

export const metadata: Metadata = {
  metadataBase: new URL(WEBSITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Eze Vazquez",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "Eze Vazquez",
    locale: "es_AR",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const language = getRequestLanguage()

  return (
    <html
      lang={language}
      suppressHydrationWarning
      className=""
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="bg-canvas font-sans text-paper antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <LanguageProvider initialLanguage={language}>
          <SiteFrame>{children}</SiteFrame>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
