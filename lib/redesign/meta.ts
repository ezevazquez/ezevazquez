import type { Metadata } from "next"
import { GITHUB_URL, LINKEDIN_URL, WEBSITE_URL } from "@/lib/constants"
import type { Language } from "@/lib/translation"
import { getRequestLanguage } from "./request-language"

export const SITE_TITLE = "Eze Vazquez — Technical Product Manager & AI Automation"
export const SITE_DESCRIPTION =
  "Eze Vazquez is a Technical Product Manager focused on AI automation, digital products and custom internal tools."

const PAGE_PATH = {
  home: "/",
  about: "/about",
  work: "/work",
  contact: "/contact",
  cv: "/cv",
} as const

export type MetaPage = keyof typeof PAGE_PATH

const META = {
  home: {
    es: { title: SITE_TITLE, description: SITE_DESCRIPTION },
    en: { title: SITE_TITLE, description: SITE_DESCRIPTION },
  },
  about: {
    es: {
      title: "About",
      description: "Desde 2018 hasta ahora. Trabajo, estudios y proyectos en paralelo.",
    },
    en: {
      title: "About",
      description: "From 2018 to now. Work, studies, and side projects.",
    },
  },
  work: {
    es: {
      title: "Work",
      description: "Gestión de proyectos técnicos, automatización con IA y sistemas a medida.",
    },
    en: {
      title: "Work",
      description: "Technical project management, AI automation, and custom systems.",
    },
  },
  contact: {
    es: {
      title: "Contacto",
      description: "Laburemos juntos. Charla corta. Me contás el problema.",
    },
    en: {
      title: "Contact",
      description: "Let's work together. A short call. Tell me the problem.",
    },
  },
  cv: {
    es: { title: "CV", description: SITE_DESCRIPTION },
    en: { title: "CV", description: SITE_DESCRIPTION },
  },
} as const

export function metaFor(page: MetaPage, language: Language): Metadata {
  const entry = META[page][language]
  const path = PAGE_PATH[page]
  const socialTitle = page === "home" ? SITE_TITLE : `${entry.title} — Eze Vazquez`

  return {
    title: page === "home" ? { absolute: SITE_TITLE } : entry.title,
    description: entry.description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description: entry.description,
      url: path,
      siteName: "Eze Vazquez",
      locale: language === "es" ? "es_AR" : "en_US",
      alternateLocale: language === "es" ? ["en_US"] : ["es_AR"],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description: entry.description,
    },
  }
}

export async function generatePageMetadata(page: MetaPage): Promise<Metadata> {
  return metaFor(page, getRequestLanguage())
}

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Eze Vazquez",
  url: WEBSITE_URL,
  jobTitle: "Technical Product Manager",
  sameAs: [LINKEDIN_URL, GITHUB_URL],
}
