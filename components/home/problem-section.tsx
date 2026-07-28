"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

export function HomeProblemSection() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const cards = t("home.problem.cards") as string[]
  const [active, setActive] = useState(0)

  return (
    <Section variant="muted">
      <SectionHeader
        eyebrow={t("home.problem.eyebrow")}
        title={t("home.problem.title")}
        description={t("home.problem.copy")}
      />

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        variants={staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={viewportOnce}
      >
        {cards.map((card, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className={i % 3 === 1 ? "lg:translate-y-3" : i % 3 === 2 ? "lg:-translate-y-1" : ""}
          >
            <motion.button
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "glass-card-interactive group h-full w-full p-6 text-left md:p-7",
                active === i && "border-primary/40 bg-primary/[0.08] shadow-[0_0_36px_-16px_rgba(59,130,246,0.45)]"
              )}
              whileHover={reduced ? undefined : { y: -3 }}
              whileTap={reduced ? undefined : { scale: 0.985 }}
            >
              <span className="mb-5 flex items-center justify-between">
                <span className={cn("h-2 w-2 rounded-full bg-white/20 transition-colors", active === i && "bg-primary shadow-[0_0_12px_rgba(59,130,246,0.9)]")} />
                <span className="text-[10px] font-semibold tracking-[0.18em] text-gray-600 group-hover:text-primary/70">
                  0{i + 1}
                </span>
              </span>
              <p className="text-[0.9375rem] leading-relaxed text-gray-200/95">{card}</p>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="relative mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30 px-5 py-4 sm:px-7"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={viewportOnce}
      >
        <div className="absolute inset-y-0 left-0 w-1 bg-primary/70" aria-hidden />
        <div className="flex items-center gap-4">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <motion.span
              className="h-2 w-2 rounded-full bg-primary"
              animate={reduced ? undefined : { scale: [1, 1.6, 1], opacity: [1, 0.45, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </span>
          <p className="text-sm text-gray-300">
            <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">{t("home.problem.signal")}</span>
            {cards[active]}
          </p>
        </div>
      </motion.div>
    </Section>
  )
}
