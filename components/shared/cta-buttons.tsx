"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

type CTAButtonProps = {
  children: ReactNode
  className?: string
  href?: string
  asChild?: boolean
}

export function PrimaryCTA({ children, className, href, asChild }: CTAButtonProps) {
  const classes = cn("btn-primary-glow inline-flex items-center justify-center", className)

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  if (asChild) {
    return <Slot className={classes}>{children}</Slot>
  }

  return <button type="button" className={classes}>{children}</button>
}

export function SecondaryCTA({ children, className, href, asChild }: CTAButtonProps) {
  const classes = cn("btn-outline-glass inline-flex items-center justify-center", className)

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  if (asChild) {
    return <Slot className={classes}>{children}</Slot>
  }

  return <button type="button" className={classes}>{children}</button>
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
    <Link href={href} className={cn("btn-outline-glass inline-flex items-center justify-center", className)}>
      {children}
    </Link>
  )
}
