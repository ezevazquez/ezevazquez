"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { scaleIn } from "@/lib/motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

type MotionCardProps = {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: "default" | "lg"
}

export function MotionCard({
  children,
  className,
  hover = true,
  padding = "default",
}: MotionCardProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={scaleIn}
      className={cn(
        hover ? "glass-card-interactive" : "glass-card",
        padding === "default" ? "p-6 md:p-7" : "p-7 md:p-9",
        className
      )}
      whileHover={reduced || !hover ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {children}
    </motion.div>
  )
}
