import { cookies, headers } from "next/headers"
import type { Language } from "@/lib/translation"
import { LANGUAGE_COOKIE_KEY } from "./config"
import { LANG_HEADER, isLanguage, resolveLanguage } from "./language"

/** Server-only: language for the current request (header → cookie → Accept-Language). */
export function getRequestLanguage(): Language {
  const headerLang = headers().get(LANG_HEADER)
  if (isLanguage(headerLang)) return headerLang
  const cookieLang = cookies().get(LANGUAGE_COOKIE_KEY)?.value
  return resolveLanguage(cookieLang, headers().get("accept-language"))
}
