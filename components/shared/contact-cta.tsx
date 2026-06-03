"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { PrimaryCTA, SecondaryCTA } from "@/components/shared/cta-buttons"
import { BOOK_CALL_URL, EMAIL_URL, SITE_EMAIL } from "@/lib/constants"
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"
import { Section } from "@/components/shared/section"

type ContactCTAProps = {
  title: string
  copy: string
  secondaryTitle?: string
  secondaryCopy?: string
  showCvLink?: boolean
  className?: string
  id?: string
}

export function ContactCTA({
  title,
  copy,
  secondaryTitle,
  secondaryCopy,
  showCvLink = false,
  className,
  id = "contact",
}: ContactCTAProps) {
  const { t } = useLanguage()
  const reduced = useReducedMotion()

  return (
    <Section id={id} variant="accent" className={cn("!pb-28 md:!pb-36", className)}>
      <motion.div
        className="relative max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-8 md:p-14 overflow-hidden shadow-[0_40px_80px_-40px_rgba(59,130,246,0.25)]"
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <div
          className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none"
          aria-hidden
        />
        {!reduced && (
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[240px] bg-gradient-radial from-blue-500/20 via-transparent to-transparent pointer-events-none"
            aria-hidden
          />
        )}

        <motion.div variants={fadeUp} className="relative z-10 text-center">
          <h2 className="text-headline mb-5">{title}</h2>
          <p className="text-subhead mb-10 max-w-xl mx-auto">{copy}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            <PrimaryCTA href={BOOK_CALL_URL} className="w-full sm:w-auto justify-center">
              {t("common.bookCall")}
            </PrimaryCTA>
            <SecondaryCTA href={EMAIL_URL} className="w-full sm:w-auto justify-center">
              {t("common.emailMe")}
            </SecondaryCTA>
          </div>

          <p className="mt-6 text-body-muted text-sm">{t("contactCta.reassurance")}</p>
          <p className="mt-4">
            <a
              href={EMAIL_URL}
              className="text-body-muted hover:text-primary transition-colors duration-300"
            >
              {SITE_EMAIL}
            </a>
          </p>
        </motion.div>

        {(secondaryTitle || showCvLink) && (
          <motion.div
            variants={fadeUp}
            className="relative z-10 mt-14 pt-10 border-t border-white/[0.08] text-center"
          >
            {secondaryTitle && (
              <>
                <h3 className="text-lg font-semibold text-white mb-2">{secondaryTitle}</h3>
                {secondaryCopy && <p className="text-body-muted mb-6">{secondaryCopy}</p>}
              </>
            )}
            {showCvLink && (
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
                <SecondaryCTA href="/cv" className="!h-11 !px-6 text-sm">
                  {t("common.downloadCV")}
                </SecondaryCTA>
                <Link
                  href="/about"
                  className="btn-outline-glass !h-11 !px-6 text-sm inline-flex items-center justify-center"
                >
                  {t("common.viewBackground")}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </Section>
  )
}
