"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionCard } from "@/components/shared/motion-card"
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

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
            <MotionCard className="h-full" padding="default">
              <p className="text-gray-200/95 text-[0.9375rem] leading-relaxed">{card}</p>
            </MotionCard>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
