"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { fadeUp } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

type PageHeroProps = {
  title: string
  subtitle?: string
  children?: ReactNode
  align?: "center" | "left"
  className?: string
}

export function PageHero({
  title,
  subtitle,
  children,
  align = "center",
  className,
}: PageHeroProps) {
  const reduced = useReducedMotion()

  return (
    <section
      className={cn(
        "relative pt-32 pb-20 md:pt-36 md:pb-24 px-4 sm:px-6 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-radial from-blue-500/12 via-transparent to-transparent pointer-events-none"
        aria-hidden
      />

      <div
        className={cn(
          "section-container relative z-10",
          align === "center" && "text-center"
        )}
      >
        <motion.h1
          className="text-display-gradient max-w-4xl mx-auto"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className={cn(
              "text-subhead mt-6 max-w-2xl",
              align === "center" && "mx-auto"
            )}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            className="mt-10"
            variants={fadeUp}
            initial={reduced ? false : "hidden"}
            animate="visible"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}
