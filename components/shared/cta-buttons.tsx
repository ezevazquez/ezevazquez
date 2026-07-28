"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Slot } from "@radix-ui/react-slot"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type CTAButtonProps = {
  children: ReactNode
  className?: string
  href?: string
  asChild?: boolean
}

function SoftPress({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <motion.span
      className={cn("inline-flex", className)}
      whileHover={reduced ? undefined : { y: -1 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
    >
      {children}
    </motion.span>
  )
}

export function PrimaryCTA({ children, className, href, asChild }: CTAButtonProps) {
  const classes = cn("btn-primary-glow inline-flex items-center justify-center", className)
  const wrapClass = className?.includes("w-full") ? "w-full" : undefined

  if (href) {
    return (
      <SoftPress className={wrapClass}>
        <a href={href} className={classes}>
          {children}
        </a>
      </SoftPress>
    )
  }

  if (asChild) {
    return (
      <SoftPress className={wrapClass}>
        <Slot className={classes}>{children}</Slot>
      </SoftPress>
    )
  }

  return (
    <SoftPress className={wrapClass}>
      <button type="button" className={classes}>
        {children}
      </button>
    </SoftPress>
  )
}

export function SecondaryCTA({ children, className, href, asChild }: CTAButtonProps) {
  const classes = cn("btn-outline-glass inline-flex items-center justify-center", className)
  const wrapClass = className?.includes("w-full") ? "w-full" : undefined

  if (href) {
    return (
      <SoftPress className={wrapClass}>
        <a href={href} className={classes}>
          {children}
        </a>
      </SoftPress>
    )
  }

  if (asChild) {
    return (
      <SoftPress className={wrapClass}>
        <Slot className={classes}>{children}</Slot>
      </SoftPress>
    )
  }

  return (
    <SoftPress className={wrapClass}>
      <button type="button" className={classes}>
        {children}
      </button>
    </SoftPress>
  )
}

export function SecondaryCTALink({
  children,
  className,
  href,
}: {
  children: ReactNode
  className?: string
  href: string
}) {
  return (
    <SoftPress className={className?.includes("w-full") ? "w-full" : undefined}>
      <Link href={href} className={cn("btn-outline-glass inline-flex items-center justify-center", className)}>
        {children}
      </Link>
    </SoftPress>
  )
}
