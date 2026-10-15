"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { translations, type Language } from "@/lib/translation"
import { LANGUAGE_COOKIE_KEY, LANGUAGE_STORAGE_KEY } from "@/lib/redesign/config"

const LanguageContext = createContext<
  | {
      language: Language
      setLanguage: (lang: Language) => void
      t: (key: string) => any
    }
  | undefined
>(undefined)

function persistLanguage(language: Language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    localStorage.setItem("language", language)
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${LANGUAGE_COOKIE_KEY}=${language};path=/;max-age=31536000;samesite=lax`
  } catch {
    /* ignore */
  }
  document.documentElement.lang = language
  document.documentElement.dataset.lang = language
}

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode
  /** From cookie / Accept-Language so SSR matches first client paint. */
  initialLanguage: Language
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage)

  useEffect(() => {
    persistLanguage(language)
  }, [language])

  const t = (key: string) => {
    const keys = key.split(".")
    let value: any = translations[language]
    for (const k of keys) {
      if (value === undefined) return key
      value = value[k]
    }
    return value === undefined ? key : value
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
