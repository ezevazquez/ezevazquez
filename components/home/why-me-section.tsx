"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Section } from "@/components/shared/section"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function HomeWhyMeSection() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const points = t("home.whyMe.points") as string[]

  return (
    <Section>
      <motion.div
        className="glass-card p-8 md:p-12"
        variants={staggerContainer}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={viewportOnce}
      >
        <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-start">
          <motion.div variants={fadeUp} className="mx-auto md:mx-0">
            <div className="relative h-32 w-32 rounded-2xl border border-primary/30 overflow-hidden bg-zinc-900 shadow-[0_20px_40px_-20px_rgba(59,130,246,0.35)]">
              <Image
                src="/profile.png"
                alt="Eze Vazquez"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          </motion.div>

          <div>
            <motion.p variants={fadeUp} className="text-eyebrow mb-4">
              {t("home.whyMe.eyebrow")}
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-headline mb-5">
              {t("home.whyMe.title")}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-subhead mb-8">
              {t("home.whyMe.copy")}
            </motion.p>
            <ul className="space-y-4 mb-10">
              {points.map((point) => (
                <motion.li
                  key={point}
                  variants={fadeUp}
                  className="flex gap-3 text-gray-200/95 text-[0.9375rem] leading-relaxed"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
                  </span>
                  {point}
                </motion.li>
              ))}
            </ul>
            <motion.div variants={fadeUp}>
              <Link href="/about" className="btn-outline-glass inline-flex items-center justify-center">
                {t("home.whyMe.cta")}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}
