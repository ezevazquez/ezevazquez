"use client"

import { createPortal } from "react-dom"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type DialogAnchor = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
}

type DialogPosition = {
  left: number
  top: number
  tailX: number
  direction: "above" | "below" | "center"
}

type StickerLinkDialogProps = {
  intro: string
  href?: string
  linkLabel?: string
  anchor?: DialogAnchor
  trigger?: HTMLElement | null
  onClose: () => void
}

export function StickerLinkDialog({ intro, href, linkLabel, anchor, trigger, onClose }: StickerLinkDialogProps) {
  const reduced = useReducedMotion()
  const dialogRef = useRef<HTMLElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const onCloseRef = useRef(onClose)
  const triggerRef = useRef(trigger)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState<DialogPosition>()
  const fullText = linkLabel ? `${intro}${linkLabel}.` : intro
  const [typedLength, setTypedLength] = useState(reduced ? fullText.length : 0)

  onCloseRef.current = onClose

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (reduced) {
      setTypedLength(fullText.length)
      return
    }
    setTypedLength(0)
    const timer = window.setInterval(() => {
      setTypedLength((length) => {
        if (length >= fullText.length) {
          window.clearInterval(timer)
          return length
        }
        return length + 1
      })
    }, 34)
    return () => window.clearInterval(timer)
  }, [fullText, reduced])

  useLayoutEffect(() => {
    if (!mounted) return

    const placeDialog = () => {
      const dialog = dialogRef.current
      if (!dialog) return

      const margin = 12
      const gap = 12
      const width = dialog.offsetWidth
      const height = dialog.offsetHeight
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const anchorCenter = anchor ? anchor.left + anchor.width / 2 : viewportWidth / 2
      const left = Math.max(margin, Math.min(viewportWidth - width - margin, anchorCenter - width / 2))

      let direction: DialogPosition["direction"] = "center"
      let top = (viewportHeight - height) / 2
      if (anchor) {
        const canPlaceAbove = anchor.top >= height + margin + gap
        const canPlaceBelow = viewportHeight - anchor.bottom >= height + margin + gap
        if (canPlaceAbove) {
          direction = "above"
          top = anchor.top - height - gap
        } else if (canPlaceBelow) {
          direction = "below"
          top = anchor.bottom + gap
        } else {
          direction = "center"
          top = Math.max(margin, Math.min(viewportHeight - height - margin, anchor.top + (anchor.bottom - anchor.top) / 2 - height / 2))
        }
      }

      const tailX = anchor
        ? Math.max(22, Math.min(width - 22, anchorCenter - left))
        : width / 2
      setPosition({ left, top, tailX, direction })
    }

    placeDialog()
    window.addEventListener("resize", placeDialog)
    return () => window.removeEventListener("resize", placeDialog)
  }, [anchor, mounted])

  useEffect(() => {
    if (!mounted) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const triggerToRestore = triggerRef.current
    ;(linkRef.current ?? dialogRef.current)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== "Tab") return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      )
      if (!focusable?.length) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      const returnTarget = triggerToRestore?.isConnected ? triggerToRestore : previousFocus
      returnTarget?.focus()
    }
  }, [mounted])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-transparent"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onCloseRef.current()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={fullText}
        tabIndex={linkLabel ? undefined : -1}
        className="fixed w-[min(16rem,calc(100vw-1.5rem))] rounded-2xl border-2 border-canvas bg-paper px-4 py-3 text-black shadow-[4px_5px_0_rgb(var(--primitive-black)/0.45)]"
        style={{
          left: position?.left ?? "50%",
          top: position?.top ?? "50%",
          visibility: position ? "visible" : "hidden",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {position?.direction !== "center" && (
          <span
            aria-hidden
            className={`absolute h-4 w-4 -translate-x-1/2 rotate-45 border-canvas bg-paper ${
              position?.direction === "above"
                ? "-bottom-2 border-b-2 border-r-2"
                : "-top-2 border-l-2 border-t-2"
            }`}
            style={{ left: position?.tailX }}
          />
        )}
        <p className="relative font-mono text-sm font-medium leading-snug text-black">
          {intro.slice(0, typedLength)}
          {href && linkLabel && (
            <a
              ref={linkRef}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
              data-cursor="click"
              aria-label={linkLabel}
              className="cursor-pointer decoration-1 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              {linkLabel.slice(0, Math.max(0, typedLength - intro.length))}
            </a>
          )}
          {linkLabel && typedLength >= fullText.length ? "." : typedLength < fullText.length ? <span aria-hidden>▍</span> : null}
        </p>
      </section>
    </div>,
    document.body,
  )
}
