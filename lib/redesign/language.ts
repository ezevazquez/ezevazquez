import type { Language } from "@/lib/translation"
import { LANGUAGE_COOKIE_KEY } from "./config"

export const LANG_HEADER = "x-eze-lang"

export function isLanguage(value: string | null | undefined): value is Language {
  return value === "en" || value === "es"
}

/** Prefer es* from Accept-Language; otherwise en. */
export function languageFromAccept(header: string | null | undefined): Language {
  if (!header) return "en"
  const parts = header.split(",").map((part) => {
    const [tag, qPart] = part.trim().split(";q=")
    return { tag: (tag || "").toLowerCase(), q: qPart ? Number(qPart) : 1 }
  })
  parts.sort((a, b) => b.q - a.q)
  const top = parts[0]?.tag || ""
  return top.startsWith("es") ? "es" : "en"
}

export function resolveLanguage(
  cookieValue: string | null | undefined,
  acceptLanguage: string | null | undefined,
): Language {
  if (isLanguage(cookieValue)) return cookieValue
  return languageFromAccept(acceptLanguage)
}

export { LANGUAGE_COOKIE_KEY }
