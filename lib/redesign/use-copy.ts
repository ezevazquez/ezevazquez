"use client"

import { useLanguage } from "@/components/language-provider"
import { copy } from "./copy"

export function useCopy() {
  const { language, setLanguage } = useLanguage()
  return { t: copy[language], language, setLanguage }
}
