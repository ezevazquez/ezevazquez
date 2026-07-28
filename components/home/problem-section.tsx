"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { ProblemVisual } from "./problem-visual"

export function HomeProblemSection() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const cards = t("home.problem.cards") as string[]

  return (
    <Section variant="muted">
      <SectionHeader
        eyebrow={t("home.problem.eyebrow")}
        title={t("home.problem.title")}
        description={t("home.problem.copy")}
      />

      <motion.div
        className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
        variants={staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={viewportOnce}
      >
        {cards.map((card, i) => (
          <motion.article key={card} variants={fadeUp} className="glass-card h-full p-5 md:p-6">
            <ProblemVisual index={i} />
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-gray-200/95">{card}</p>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  )
}
