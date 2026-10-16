"use client"

import { useEffect, useRef } from "react"
import { useCopy } from "@/lib/redesign/use-copy"

type StickerLinkDialogProps = {
  href: string
  anchor?: { left: number; top: number; width: number }
  onClose: () => void
}

export function StickerLinkDialog({ href, anchor, onClose }: StickerLinkDialogProps) {
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
      className="fixed inset-0 z-[100]"
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
        className="absolute w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-full rounded-[1.6rem] border-[3px] border-paper bg-paper p-5 text-canvas shadow-[7px_8px_0_rgb(var(--primitive-black)/0.55)]"
        style={{ left: anchor ? anchor.left + anchor.width / 2 : "50%", top: anchor ? anchor.top - 12 : "50%" }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span aria-hidden className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-b-[3px] border-r-[3px] border-paper bg-paper" />
        <div className="relative flex items-start justify-between gap-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-canvas/45">{t.stickerDialog.kicker}</p>
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
        <p id="linkedin-dialog-title" className="relative mt-5 font-mono text-2xl font-medium leading-[1.05] tracking-[-0.05em] sm:text-3xl">
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
