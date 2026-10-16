import type { ReactNode } from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"
import { SiteFrame } from "@/components/redesign/site-frame"
import { BOOT_SCRIPT } from "@/lib/redesign/boot-script"
import { getRequestLanguage } from "@/lib/redesign/request-language"

export const metadata: Metadata = {
  title: {
    default: "Eze Vazquez | Technical PM",
    template: "%s | Eze Vazquez",
  },
  description:
    "Technical PM. Armo sistemas que trabajan por vos. / I build systems that work for you.",
  alternates: {
    languages: {
      es: "/",
      en: "/",
    },
  },
  openGraph: {
    title: "Eze Vazquez | Technical PM",
    description:
      "Technical PM. Armo sistemas que trabajan por vos. / I build systems that work for you.",
    locale: "es_AR",
    alternateLocale: ["en_US"],
    type: "website",
  },
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
        <LanguageProvider initialLanguage={language}>
          <SiteFrame>{children}</SiteFrame>
        </LanguageProvider>
      </body>
    </html>
  )
}
