"use client"

import { forwardRef, type ComponentProps, type MouseEvent } from "react"
import Link from "next/link"
import { useTransitionNav } from "./transition-context"

type Props = ComponentProps<typeof Link>

export const TransitionLink = forwardRef<HTMLAnchorElement, Props>(
  function TransitionLink({ href, onClick, ...rest }, ref) {
    const { navigate } = useTransitionNav()
    const target = typeof href === "string" ? href : href.pathname || "/"

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (event.button !== 0) return
      if (target.startsWith("http") || target.startsWith("mailto:") || target.startsWith("#")) return
      event.preventDefault()
      navigate(target)
    }

    return <Link ref={ref} href={href} onClick={handleClick} {...rest} />
  },
)
