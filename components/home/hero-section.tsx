"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { PrimaryCTA, SecondaryCTALink } from "@/components/shared/cta-buttons"
import { BOOK_CALL_URL } from "@/lib/constants"
import { HeroSystemMap } from "./hero-system-map"

export function HomeHeroSection() {
  const { t } = useLanguage()
  const outcomes = t("home.hero.outcomes") as string[]

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center px-4 sm:px-6 pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-radial from-blue-500/15 via-transparent to-transparent pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 section-container w-full">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-20 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.p
              className="text-eyebrow mb-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t("home.hero.eyebrow")}
            </motion.p>

            <motion.h1
              className="text-display-gradient mb-7"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {t("home.hero.title")}
            </motion.h1>

            <motion.p
              className="text-subhead mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
            >
              {t("home.hero.subtitle")}
            </motion.p>

            <motion.ul
              className="mb-8 space-y-2.5 max-w-md mx-auto lg:mx-0 text-left"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {outcomes.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-gray-300/95">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div
              className="flex flex-col sm:flex-row gap-2.5 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.5 }}
            >
              <PrimaryCTA href={BOOK_CALL_URL} className="w-full sm:w-auto justify-center">
                {t("common.bookCall")}
              </PrimaryCTA>
              <SecondaryCTALink href="/work" className="w-full sm:w-auto justify-center">
                {t("common.seeWhatIBuild")}
              </SecondaryCTALink>
            </motion.div>
          </div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroSystemMap
              sources={t("home.hero.sources") as string[]}
              systemLabel={t("home.hero.systemLabel") as string}
              systemTitle={t("home.hero.systemTitle") as string}
              bullets={t("home.hero.systemBullets") as string[]}
              statusLabel={t("home.hero.visualStatus") as string}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
