"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { translations, type Language } from "@/lib/translation"

const STORAGE_KEY = "ezevazquez-language"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "es"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem("language")
    if (isLanguage(saved)) {
      setLanguage(saved)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, language)
    // Keep the legacy key in sync for older sessions.
    localStorage.setItem("language", language)
    document.documentElement.lang = language
  }, [language, hydrated])

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
