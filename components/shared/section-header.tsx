"use client"

import { motion } from "framer-motion"
import { fadeUp, viewportOnce } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

type SectionHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeader({
  title,
  description,
  eyebrow,
  align = "center",
  className,
}: SectionHeaderProps) {
  const reduced = useReducedMotion()

  return (
    <motion.header
      className={cn(
        "mb-12 md:mb-16 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={viewportOnce}
      variants={fadeUp}
    >
      {eyebrow && <p className="text-eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-headline">{title}</h2>
      {description && (
        <p className="mt-5 text-subhead max-w-2xl mx-auto">{description}</p>
      )}
      <div
        className={cn(
          "mt-8 h-px w-16 bg-gradient-to-r from-primary/60 to-transparent",
          align === "center" && "mx-auto"
        )}
        aria-hidden
      />
    </motion.header>
  )
}
