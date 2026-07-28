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
  fullOnMobile = false,
}: {
  children: ReactNode
  className?: string
  fullOnMobile?: boolean
}) {
  const reduced = useReducedMotion()

  return (
    <motion.span
      className={cn(
        "inline-flex justify-center",
        fullOnMobile && "w-full sm:w-auto",
        className
      )}
      whileHover={reduced ? undefined : { y: -1 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
    >
      {children}
    </motion.span>
  )
}

function isFullWidthOnMobile(className?: string) {
  return Boolean(className?.includes("w-full"))
}

export function PrimaryCTA({ children, className, href, asChild }: CTAButtonProps) {
  const classes = cn("btn-primary-glow inline-flex items-center justify-center", className)
  const fullOnMobile = isFullWidthOnMobile(className)

  if (href) {
    return (
      <SoftPress fullOnMobile={fullOnMobile}>
        <a href={href} className={classes}>
          {children}
        </a>
      </SoftPress>
    )
  }

  if (asChild) {
    return (
      <SoftPress fullOnMobile={fullOnMobile}>
        <Slot className={classes}>{children}</Slot>
      </SoftPress>
    )
  }

  return (
    <SoftPress fullOnMobile={fullOnMobile}>
      <button type="button" className={classes}>
        {children}
      </button>
    </SoftPress>
  )
}

export function SecondaryCTA({ children, className, href, asChild }: CTAButtonProps) {
  const classes = cn("btn-outline-glass inline-flex items-center justify-center", className)
  const fullOnMobile = isFullWidthOnMobile(className)

  if (href) {
    return (
      <SoftPress fullOnMobile={fullOnMobile}>
        <a href={href} className={classes}>
          {children}
        </a>
      </SoftPress>
    )
  }

  if (asChild) {
    return (
      <SoftPress fullOnMobile={fullOnMobile}>
        <Slot className={classes}>{children}</Slot>
      </SoftPress>
    )
  }

  return (
    <SoftPress fullOnMobile={fullOnMobile}>
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
    <SoftPress fullOnMobile={isFullWidthOnMobile(className)}>
      <Link href={href} className={cn("btn-outline-glass inline-flex items-center justify-center", className)}>
        {children}
      </Link>
    </SoftPress>
  )
}
