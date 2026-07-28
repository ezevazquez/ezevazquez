"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Mail, FileDown } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SiteShell } from "@/components/site-shell"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionCard } from "@/components/shared/motion-card"
import { ContactCTA } from "@/components/shared/contact-cta"
import { PageHero } from "@/components/shared/page-hero"
import { SecondaryCTA } from "@/components/shared/cta-buttons"
import { CVDownloadButton } from "@/components/cv-download-button"
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL, SITE_EMAIL } from "@/lib/constants"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

export default function AboutPage() {
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const paragraphs = t("about.bio.paragraphs") as string[]
  const experience = t("about.experience.items") as {
    company: string
    role: string
    period: string
    focus: string
  }[]
  const capabilityGroups = t("about.capabilities.groups") as {
    name: string
    items: string[]
  }[]
  const principles = t("about.philosophy.principles") as string[]

  return (
    <SiteShell>
      <PageHero title={t("about.hero.title")} subtitle={t("about.hero.subtitle")}>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 justify-center items-center">
          <CVDownloadButton
            textKey="common.downloadCV"
            directDownload
            className="btn-primary-glow !border-0"
          />
          <SecondaryCTA href={EMAIL_URL}>{t("common.contactMe")}</SecondaryCTA>
          <SecondaryCTA href={LINKEDIN_URL}>{t("common.viewLinkedIn")}</SecondaryCTA>
        </div>
      </PageHero>

      <Section variant="muted" narrow>
        <SectionHeader
          title={t("about.bio.title")}
          align="left"
          className="max-w-none mx-0 text-left"
        />
        <div className="space-y-7">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-subhead text-lg">
              {p}
            </p>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <SectionHeader
            title={t("about.experience.title")}
            align="left"
            className="mb-0 max-w-none mx-0 text-left"
          />
          <CVDownloadButton
            textKey="about.experience.downloadCV"
            directDownload
            className="btn-outline-glass shrink-0"
          />
        </div>
        <motion.div
          className="space-y-5"
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={viewportOnce}
        >
          {experience.map((job) => (
            <motion.div key={job.company} variants={fadeUp}>
              <MotionCard padding="lg">
                <p className="text-eyebrow text-primary/90 mb-2">{job.period}</p>
                <h3 className="text-xl font-bold text-white tracking-tight">{job.role}</h3>
                <p className="text-primary font-medium mt-1 mb-3">{job.company}</p>
                <p className="text-gray-300/90 text-[0.9375rem] leading-relaxed">{job.focus}</p>
              </MotionCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Section variant="muted">
        <SectionHeader title={t("about.capabilities.title")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilityGroups.map((group) => (
            <MotionCard key={group.name} hover={false}>
              <h3 className="font-bold text-primary text-xs uppercase tracking-wider mb-4">
                {group.name}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-gray-300/90 flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary/60 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </MotionCard>
          ))}
        </div>
      </Section>

      <Section narrow>
        <SectionHeader title={t("about.philosophy.title")} />
        <motion.ul
          className="space-y-6"
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={viewportOnce}
        >
          {principles.map((principle) => (
            <motion.li
              key={principle}
              variants={fadeUp}
              className="glass-card px-6 py-5 md:px-8 md:py-6"
            >
              <p className="text-lg md:text-xl font-medium text-gray-100 leading-snug tracking-tight">
                &ldquo;{principle}&rdquo;
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      <Section variant="muted" narrow>
        <SectionHeader title={t("about.links.title")} />
        <div className="grid sm:grid-cols-2 gap-4">
          <LinkCard href="/cv" icon={<FileDown className="h-5 w-5" />} label={t("common.downloadCV")} />
          <LinkCard
            href={LINKEDIN_URL}
            icon={<Linkedin className="h-5 w-5" />}
            label="LinkedIn"
            external
          />
          <LinkCard
            href={GITHUB_URL}
            icon={<Github className="h-5 w-5" />}
            label="GitHub"
            external
          />
          <LinkCard href={EMAIL_URL} icon={<Mail className="h-5 w-5" />} label={SITE_EMAIL} />
        </div>
      </Section>

      <ContactCTA
        title={t("about.finalCta.titleClients")}
        copy={t("about.finalCta.copyClients")}
        secondaryTitle={t("about.finalCta.titleRecruiters")}
        secondaryCopy={t("about.finalCta.copyRecruiters")}
        showCvLink
      />
    </SiteShell>
  )
}

function LinkCard({
  href,
  icon,
  label,
  external,
}: {
  href: string
  icon: ReactNode
  label: string
  external?: boolean
}) {
  const className = cn(
    "glass-card-interactive flex items-center gap-4 p-5 group"
  )

  const inner = (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 border border-primary/25 text-primary transition-colors group-hover:bg-primary/25">
        {icon}
      </span>
      <span className="font-medium text-gray-100 group-hover:text-white transition-colors">
        {label}
      </span>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  )
}
