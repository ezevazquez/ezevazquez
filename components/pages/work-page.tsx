"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { SiteShell } from "@/components/site-shell"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionCard } from "@/components/shared/motion-card"
import { ContactCTA } from "@/components/shared/contact-cta"
import { PlaceholderVisual } from "@/components/shared/placeholder-visual"
import { PageHero } from "@/components/shared/page-hero"
import { PrimaryCTA } from "@/components/shared/cta-buttons"
import { BOOK_CALL_URL } from "@/lib/constants"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const visualVariants = ["form", "flow", "messages", "dashboard"] as const

export default function WorkPage() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const labels = t("work.featured.labels") as {
    problem: string
    system: string
    outcome: string
  }
  const featured = t("work.featured.items") as {
    label: string
    title: string
    problem: string
    system: string
    outcome: string
  }[]
  const anatomy = t("work.anatomy.parts") as { title: string; description: string }[]
  const toolGroups = t("work.tools.groups") as { name: string; items: string[] }[]

  return (
    <SiteShell>
      <PageHero title={t("work.hero.title")} subtitle={t("work.hero.subtitle")}>
        <PrimaryCTA href={BOOK_CALL_URL}>{t("work.hero.cta")}</PrimaryCTA>
      </PageHero>

      <Section variant="muted">
        <SectionHeader
          title={t("work.featured.title")}
          align="left"
          className="max-w-none mx-0 text-left mb-14"
        />
        <motion.div
          className="space-y-20 md:space-y-28"
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={viewportOnce}
        >
          {featured.map((item, i) => (
            <motion.article
              key={item.title}
              variants={fadeUp}
              className="grid md:grid-cols-2 gap-10 md:gap-14 items-center"
            >
              <div className={cn("space-y-5", i % 2 === 1 && "md:order-2")}>
                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary text-[10px] uppercase tracking-wider font-semibold px-2.5"
                >
                  {item.label}
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
                  {item.title}
                </h3>
                <dl className="space-y-4 text-[0.9375rem]">
                  <div>
                    <dt className="text-eyebrow text-gray-500 mb-1.5">{labels.problem}</dt>
                    <dd className="text-gray-200/95 leading-relaxed">{item.problem}</dd>
                  </div>
                  <div>
                    <dt className="text-eyebrow text-gray-500 mb-1.5">{labels.system}</dt>
                    <dd className="text-gray-200/95 leading-relaxed">{item.system}</dd>
                  </div>
                  <div className="pt-2 border-t border-white/[0.06]">
                    <dt className="text-eyebrow mb-1.5">{labels.outcome}</dt>
                    <dd className="text-blue-200/90 leading-relaxed">{item.outcome}</dd>
                  </div>
                </dl>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <PlaceholderVisual variant={visualVariants[i % visualVariants.length]} />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Section>

      <Section>
        <SectionHeader title={t("work.anatomy.title")} />
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={viewportOnce}
        >
          {anatomy.map((part) => (
            <motion.div key={part.title} variants={fadeUp}>
              <MotionCard hover={false}>
                <h3 className="font-bold text-primary text-sm uppercase tracking-wide mb-2">
                  {part.title}
                </h3>
                <p className="text-gray-300/90 text-sm leading-relaxed">{part.description}</p>
              </MotionCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section variant="muted">
        <SectionHeader
          title={t("work.tools.title")}
          description={t("work.tools.subtitle")}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {toolGroups.map((group) => (
            <MotionCard key={group.name} hover={false}>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
                {group.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] text-gray-300 border border-white/[0.08] hover:border-primary/25 hover:text-white transition-colors duration-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </MotionCard>
          ))}
        </div>
      </Section>

      <ContactCTA title={t("work.finalCta.title")} copy={t("work.finalCta.copy")} />
    </SiteShell>
  )
}
