"use client"

import { motion } from "framer-motion"
import { PrimaryCTA, SecondaryCTA } from "@/components/shared/cta-buttons"
import { BOOK_CALL_URL, EMAIL_URL } from "@/lib/constants"
import { viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

type ConversionStripProps = {
  title: string
  copy: string
  primaryLabel: string
  secondaryLabel: string
  className?: string
}

export function ConversionStrip({
  title,
  copy,
  primaryLabel,
  secondaryLabel,
  className,
}: ConversionStripProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl border border-primary/20 bg-primary/[0.06] px-6 py-8 md:px-10 md:py-10 text-center",
        "shadow-[0_0_40px_-16px_rgba(59,130,246,0.35)]",
        className
      )}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-3">{title}</h3>
      <p className="text-subhead text-base md:text-lg max-w-xl mx-auto mb-7">{copy}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
        <PrimaryCTA href={BOOK_CALL_URL} className="w-full sm:w-auto justify-center">
          {primaryLabel}
        </PrimaryCTA>
        <SecondaryCTA href={EMAIL_URL} className="w-full sm:w-auto justify-center">
          {secondaryLabel}
        </SecondaryCTA>
      </div>
    </motion.div>
  )
}
