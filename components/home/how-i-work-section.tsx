"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function HomeHowIWorkSection() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const steps = t("home.howIWork.steps") as { title: string; description: string }[]

  return (
    <Section variant="muted" narrow>
      <SectionHeader
        eyebrow={t("home.howIWork.eyebrow")}
        title={t("home.howIWork.title")}
      />

      <motion.ol
        className="relative space-y-0"
        variants={staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={viewportOnce}
      >
        <div
          className="absolute left-[1.125rem] top-3 bottom-3 w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent hidden sm:block"
          aria-hidden
        />
        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            variants={fadeUp}
            className="relative flex gap-6 pb-12 last:pb-0"
          >
            <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-bold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)]">
              {i + 1}
            </span>
            <div className="pt-0.5 flex-1 glass-card !p-5 md:!p-6">
              <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
              <p className="text-gray-300/90 text-sm mt-2 leading-relaxed">{step.description}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  )
}
