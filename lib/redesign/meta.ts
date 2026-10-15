import type { Metadata } from "next"
import type { Language } from "@/lib/translation"
import { getRequestLanguage } from "./request-language"

const META = {
  home: {
    es: {
      title: "Eze Vazquez | Technical PM",
      description:
        "Technical PM. Armo sistemas que trabajan por vos. Ordeno equipos, procesos y operaciones con IA.",
    },
    en: {
      title: "Eze Vazquez | Technical PM",
      description:
        "Technical PM. I build systems that work for you. Teams, processes, and operations with AI.",
    },
  },
  about: {
    es: {
      title: "About | Eze Vazquez",
      description: "Desde 2018 hasta ahora. Trabajo, estudios y proyectos en paralelo.",
    },
    en: {
      title: "About | Eze Vazquez",
      description: "From 2018 to now. Work, studies, and side projects.",
    },
  },
  work: {
    es: {
      title: "Work | Eze Vazquez",
      description: "Gestión de proyectos técnicos, automatización con IA y sistemas a medida.",
    },
    en: {
      title: "Work | Eze Vazquez",
      description: "Technical project management, AI automation, and custom systems.",
    },
  },
  contact: {
    es: {
      title: "Contacto | Eze Vazquez",
      description: "Laburemos juntos. Charla corta. Me contás el problema.",
    },
    en: {
      title: "Contact | Eze Vazquez",
      description: "Let's work together. A short call. Tell me the problem.",
    },
  },
} as const

export type MetaPage = keyof typeof META

export function metaFor(page: MetaPage, language: Language): Metadata {
  const entry = META[page][language]
  return {
    title: entry.title,
    description: entry.description,
    openGraph: {
      title: entry.title,
      description: entry.description,
      locale: language === "es" ? "es_AR" : "en_US",
      alternateLocale: language === "es" ? ["en_US"] : ["es_AR"],
      type: "website",
    },
  }
}

export async function generatePageMetadata(page: MetaPage): Promise<Metadata> {
  return metaFor(page, getRequestLanguage())
}
