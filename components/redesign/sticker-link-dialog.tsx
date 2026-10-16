"use client"

import { useEffect, useRef } from "react"
import { useCopy } from "@/lib/redesign/use-copy"

type StickerLinkDialogProps = {
  href: string
  onClose: () => void
}

export function StickerLinkDialog({ href, onClose }: StickerLinkDialogProps) {
  const { t } = useCopy()
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key !== "Tab") return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      )
      if (!focusable?.length) return
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
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-canvas/75 px-5 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="linkedin-dialog-title"
        className="relative w-full max-w-sm rotate-[-1deg] border-[3px] border-canvas bg-paper p-7 text-canvas shadow-[8px_9px_0_rgb(var(--color-canvas))]"
      >
        <span aria-hidden className="absolute -bottom-4 left-12 h-8 w-8 rotate-45 border-b-[3px] border-r-[3px] border-canvas bg-paper" />
        <div className="relative flex items-start justify-between gap-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-signal-deep">Connection found</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-2 grid h-9 w-9 place-items-center border-2 border-canvas font-mono text-sm transition-colors hover:bg-canvas hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
            aria-label={t.stickerDialog.close}
          >
            ×
          </button>
        </div>
        <p id="linkedin-dialog-title" className="relative mt-7 font-display text-4xl leading-[0.92] tracking-[-0.05em] sm:text-5xl">
          {t.stickerDialog.linkedin.intro}
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="decoration-2 underline underline-offset-4 transition-colors hover:text-signal-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
          >
            {t.stickerDialog.linkedin.link}
          </a>
          .
        </p>
      </section>
    </div>
  )
}
