"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

export function HomeTransformationSection() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const before = t("home.transformation.before") as { label: string; items: string[] }
  const after = t("home.transformation.after") as { label: string; items: string[] }

  return (
    <Section>
      <SectionHeader
        eyebrow={t("home.transformation.eyebrow")}
        title={t("home.transformation.title")}
      />

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <motion.div
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={viewportOnce}
          className="glass-card p-6 md:p-8"
        >
          <p className="text-eyebrow text-gray-500 mb-6">{before.label}</p>
          <div className="space-y-3">
            {before.items.map((item, i) => (
              <motion.div
                key={item}
                variants={fadeUp}
                className={cn(
                  "px-4 py-3.5 rounded-xl border border-white/[0.06] bg-zinc-950/50 text-gray-400 text-sm leading-snug",
                  !reduced && i % 2 === 1 && "ml-3"
                )}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={viewportOnce}
          className="glass-card p-6 md:p-8 border-primary/20 shadow-[0_0_40px_-20px_rgba(59,130,246,0.3)]"
        >
          <p className="text-eyebrow mb-6">{after.label}</p>
          <div className="space-y-3">
            {after.items.map((item) => (
              <motion.div
                key={item}
                variants={fadeUp}
                className="px-4 py-3.5 rounded-xl border border-primary/25 bg-primary/[0.08] text-gray-100 text-sm leading-snug"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
