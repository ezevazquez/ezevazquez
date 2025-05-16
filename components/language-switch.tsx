"use client"

import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="relative px-3 py-1.5 h-auto text-sm font-medium"
      >
        EN
        {language === "en" && (
          <motion.div
            layoutId="languageIndicator"
            className="absolute inset-0 bg-primary rounded-md -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Button>
      <Button
        variant={language === "es" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("es")}
        className="relative px-3 py-1.5 h-auto text-sm font-medium"
      >
        ES
        {language === "es" && (
          <motion.div
            layoutId="languageIndicator"
            className="absolute inset-0 bg-primary rounded-md -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Button>
    </div>
  )
}
