"use client"

import type { ReactNode } from "react"
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
                <ServicePreview index={i} icon={<Icon className="h-4 w-4" aria-hidden />} reduced={reduced} />
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

function ServicePreview({
  index,
  icon,
  reduced,
}: {
  index: number
  icon: ReactNode
  reduced: boolean
}) {
  if (index === 0) {
    return (
      <div className="relative mb-6 h-28 overflow-hidden rounded-xl border border-primary/15 bg-[linear-gradient(135deg,rgba(59,130,246,0.14),rgba(255,255,255,0.02))] p-4">
        <div className="flex items-center justify-between text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">{icon}</span>
          <span className="h-1.5 w-12 rounded-full bg-primary/25" />
        </div>
        <motion.div
          className="absolute bottom-4 left-4 h-2.5 rounded-full bg-white/85"
          animate={reduced ? undefined : { width: ["32%", "62%", "48%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "48%" }}
        />
        <div className="absolute bottom-8 left-4 h-1.5 w-2/3 rounded-full bg-white/15" />
      </div>
    )
  }

  if (index === 1) {
    return (
      <div className="relative mb-6 flex h-28 items-center gap-2 overflow-hidden rounded-xl border border-primary/15 bg-black/20 px-4">
        {[0, 1, 2].map((step) => (
          <div key={step} className="relative z-10 flex flex-1 flex-col items-center gap-2">
            <motion.span
              className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary"
              animate={reduced ? undefined : { scale: step === 1 ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 1.8, repeat: Infinity, delay: step * 0.22 }}
            >
              {step === 1 ? icon : <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </motion.span>
            <span className="h-1.5 w-full rounded-full bg-white/10" />
          </div>
        ))}
        <motion.div
          className="absolute left-5 right-5 top-[3.35rem] h-px bg-primary/45"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </div>
    )
  }

  if (index === 2) {
    return (
      <div className="relative mb-6 h-28 overflow-hidden rounded-xl border border-primary/15 bg-black/20 p-4">
        <div className="flex items-center justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">{icon}</span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-primary/70">Sync</span>
        </div>
        {[0, 1, 2].map((line) => (
          <motion.div
            key={line}
            className="mt-2 h-1.5 rounded-full bg-white/10"
            animate={reduced ? undefined : { opacity: [0.35, 1, 0.35], width: ["52%", "82%", "64%"] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: line * 0.24 }}
            style={{ width: `${64 - line * 9}%` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="relative mb-6 h-28 overflow-hidden rounded-xl border border-primary/15 bg-[radial-gradient(circle_at_70%_35%,rgba(59,130,246,0.24),transparent_35%),rgba(0,0,0,0.2)] p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">{icon}</div>
      <motion.div
        className="absolute right-5 top-5 h-12 w-12 rounded-full border border-primary/35"
        animate={reduced ? undefined : { scale: [0.75, 1.25, 0.75], opacity: [0.8, 0.2, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <div className="absolute bottom-4 left-4 right-4 flex gap-1.5">
        {[0, 1, 2, 3, 4].map((dot) => <span key={dot} className="h-1.5 flex-1 rounded-full bg-primary/25" />)}
      </div>
    </div>
  )
}
