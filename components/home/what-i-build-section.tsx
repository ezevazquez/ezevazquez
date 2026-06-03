"use client"

import { motion } from "framer-motion"
import { Globe, Workflow, Zap, Bot } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionCard } from "@/components/shared/motion-card"
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const icons = [Globe, Workflow, Zap, Bot]

export function HomeWhatIBuildSection() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const cards = t("home.whatIBuild.cards") as { title: string; description: string }[]

  return (
    <Section>
      <SectionHeader
        eyebrow={t("home.whatIBuild.eyebrow")}
        title={t("home.whatIBuild.title")}
        description={t("home.whatIBuild.subtitle")}
      />

      <motion.div
        className="grid sm:grid-cols-2 gap-5 md:gap-6"
        variants={staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={viewportOnce}
      >
        {cards.map((card, i) => {
          const Icon = icons[i] ?? Globe
          return (
            <motion.div key={card.title} variants={fadeUp}>
              <MotionCard className="h-full group" padding="lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 border border-primary/25 mb-5 transition-colors group-hover:bg-primary/25">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{card.title}</h3>
                <p className="text-gray-300/90 text-[0.9375rem] leading-relaxed">{card.description}</p>
              </MotionCard>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}
