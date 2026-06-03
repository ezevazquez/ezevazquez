"use client"

import { useLanguage } from "./language-provider"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5",
        compact && "scale-90 origin-right"
      )}
      role="group"
      aria-label="Language"
    >
      {(["en", "es"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={cn(
            "relative px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-full transition-colors duration-200",
            language === lang ? "text-white" : "text-gray-500 hover:text-gray-300"
          )}
        >
          {language === lang && (
            <motion.span
              layoutId="languagePill"
              className="absolute inset-0 rounded-full bg-primary/90 shadow-[0_0_12px_-2px_rgba(59,130,246,0.6)]"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{lang}</span>
        </button>
      ))}
    </div>
  )
}
