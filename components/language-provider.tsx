"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { translations, type Language } from "@/lib/translation"
import { LANGUAGE_STORAGE_KEY } from "@/lib/redesign/config"

const LanguageContext = createContext<
  | {
      language: Language
      setLanguage: (lang: Language) => void
      t: (key: string) => any
    }
  | undefined
>(undefined)

function isLanguage(value: string | null | undefined): value is Language {
  return value === "en" || value === "es"
}

function readBootLanguage(): Language {
  if (typeof document === "undefined") return "en"
  const fromDom = document.documentElement.dataset.lang || document.documentElement.lang
  if (isLanguage(fromDom)) return fromDom
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? localStorage.getItem("language")
    if (isLanguage(saved)) return saved
  } catch {
    /* ignore */
  }
  const browser = (navigator.language || "").toLowerCase()
  return browser.startsWith("es") ? "es" : "en"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(readBootLanguage)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLanguage(readBootLanguage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
      localStorage.setItem("language", language)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = language
    document.documentElement.dataset.lang = language
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
