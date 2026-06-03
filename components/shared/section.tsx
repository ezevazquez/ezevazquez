"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type SectionVariant = "default" | "muted" | "accent"

type SectionProps = {
  children: ReactNode
  variant?: SectionVariant
  className?: string
  containerClassName?: string
  narrow?: boolean
  id?: string
}

export function Section({
  children,
  variant = "default",
  className,
  containerClassName,
  narrow = false,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-padding relative",
        variant === "muted" && "bg-zinc-950/80 border-y border-white/[0.06]",
        variant === "accent" && "bg-gradient-to-b from-transparent via-blue-950/15 to-transparent",
        className
      )}
    >
      {variant === "muted" && <div className="section-glow-top" aria-hidden />}
      {variant === "muted" && <div className="section-glow-bottom" aria-hidden />}
      {variant === "accent" && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-radial from-blue-500/[0.07] via-transparent to-transparent"
          aria-hidden
        />
      )}
      <div
        className={cn(
          narrow ? "section-container-narrow" : "section-container",
          "relative z-10",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}
