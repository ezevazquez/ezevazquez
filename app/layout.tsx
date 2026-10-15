import type { ReactNode } from "react"
import type { Metadata } from "next"
import { DM_Mono, Outfit, Syne } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"
import { SiteFrame } from "@/components/redesign/site-frame"
import { BOOT_SCRIPT } from "@/lib/redesign/boot-script"

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
})

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
})

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
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${outfit.variable} ${dmMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="bg-[#12131A] font-sans text-[#F4F1EA] antialiased">
        <LanguageProvider>
          <SiteFrame>{children}</SiteFrame>
        </LanguageProvider>
      </body>
    </html>
  )
}
