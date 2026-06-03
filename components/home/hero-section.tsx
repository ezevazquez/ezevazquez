"use client"

import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { PrimaryCTA, SecondaryCTALink } from "@/components/shared/cta-buttons"
import { BOOK_CALL_URL } from "@/lib/constants"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

export function HomeHeroSection() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const messy = t("home.hero.messy") as string[]
  const organized = t("home.hero.organized") as string[]
  const outcomes = t("home.hero.outcomes") as string[]
  const visualBefore = t("home.hero.visualBefore") as string
  const visualAfter = t("home.hero.visualAfter") as string

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
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-3"
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

            <motion.p
              className="text-xs text-primary/80 font-medium mb-4 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
            >
              {t("home.hero.ctaHint")}
            </motion.p>

            <motion.p
              className="text-body-muted max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
            >
              {t("home.hero.trust")}
            </motion.p>
          </div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroSystemVisual
              messy={messy}
              organized={organized}
              reduced={reduced}
              beforeLabel={visualBefore}
              afterLabel={visualAfter}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function HeroSystemVisual({
  messy,
  organized,
  reduced,
  beforeLabel,
  afterLabel,
}: {
  messy: string[]
  organized: string[]
  reduced: boolean
  beforeLabel: string
  afterLabel: string
}) {
  return (
    <div className="glass-card p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-primary/15 to-transparent pointer-events-none" aria-hidden />

      <div className="flex items-stretch justify-center gap-3 sm:gap-5 min-h-[300px] sm:min-h-[320px]">
        <div className="flex flex-col justify-center gap-2.5 flex-1 min-w-0">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 text-center">
            {beforeLabel}
          </span>
          {messy.map((label, i) => (
            <motion.span
              key={label}
              className={cn(
                "px-3 py-2.5 rounded-xl text-xs font-medium border border-white/10 bg-zinc-900/80 text-gray-400 text-center",
                !reduced && "shadow-sm"
              )}
              style={{ marginLeft: i % 2 === 0 ? 0 : 8, marginRight: i % 2 === 1 ? 0 : 8 }}
              initial={{ opacity: 0, x: -16, rotate: reduced ? 0 : -1.5 + i * 0.5 }}
              animate={
                reduced
                  ? { opacity: 1, x: 0 }
                  : {
                      opacity: 1,
                      x: 0,
                      y: [0, -3, 0],
                    }
              }
              transition={{
                opacity: { delay: 0.25 + i * 0.07, duration: 0.4 },
                x: { delay: 0.25 + i * 0.07, duration: 0.4 },
                y: reduced ? undefined : { duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {label}
            </motion.span>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center shrink-0 px-1">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, type: "spring", stiffness: 260 }}
            aria-hidden
          >
            <ArrowRight className="h-5 w-5 hidden sm:block" />
            <ArrowRight className="h-4 w-4 rotate-90 sm:hidden" />
          </motion.div>
        </div>

        <div className="flex flex-col justify-center gap-2.5 flex-1 min-w-0">
          <span className="text-[10px] uppercase tracking-widest text-primary/80 mb-1 text-center">
            {afterLabel}
          </span>
          {organized.map((label, i) => (
            <motion.span
              key={label}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold border border-primary/35 bg-primary/10 text-blue-50 text-center shadow-[0_0_20px_-8px_rgba(59,130,246,0.5)]"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {label}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}
