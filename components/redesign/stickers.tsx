"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"

type Draw = "git" | "in" | "mail" | "cal" | "mate" | "jira" | "excel" | "stamp"

type StickerData = {
  id: string
  label: keyof ReturnType<typeof useCopy>["t"]["stickers"]
  href?: string
  x: string
  y: string
  rotate: number
  mobile?: boolean
  draw: Draw
}

const STICKERS: StickerData[] = [
  { id: "git", label: "github", href: GITHUB_URL, x: "6%", y: "16%", rotate: -8, mobile: true, draw: "git" },
  { id: "in", label: "linkedin", href: LINKEDIN_URL, x: "74%", y: "12%", rotate: 6, mobile: true, draw: "in" },
  { id: "mail", label: "mail", href: EMAIL_URL, x: "8%", y: "70%", rotate: 4, mobile: true, draw: "mail" },
  { id: "cal", label: "agenda", href: "/contact", x: "76%", y: "64%", rotate: -6, mobile: true, draw: "cal" },
  { id: "mate", label: "mate", x: "18%", y: "40%", rotate: -12, draw: "mate" },
  { id: "jira", label: "jira", x: "80%", y: "36%", rotate: 8, draw: "jira" },
  { id: "excel", label: "excel", x: "14%", y: "84%", rotate: 3, draw: "excel" },
  { id: "stamp", label: "stamp", x: "68%", y: "80%", rotate: -4, draw: "stamp" },
]

function Drawing({ kind }: { kind: Draw }) {
  if (kind === "mate") {
    return (
      <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden>
        <path d="M18 22h22v16a12 12 0 0 1-12 12h-2a10 10 0 0 1-10-10V22z" fill="none" stroke="#12131A" strokeWidth="2" />
        <path d="M40 28h6a6 6 0 0 1 0 12h-6" fill="none" stroke="#12131A" strokeWidth="2" />
        <path d="M28 14c2 4 2 4 0 8M34 12c2 4 2 4 0 8" fill="none" stroke="#1F4BFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === "jira") {
    return <span className="font-mono text-[11px] font-medium text-[#12131A]">JIRA-47</span>
  }
  if (kind === "excel") {
    return (
      <svg viewBox="0 0 64 48" className="h-8 w-12" aria-hidden>
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 4 }, (_, col) => (
            <rect
              key={`${row}-${col}`}
              x={4 + col * 14}
              y={4 + row * 13}
              width="13"
              height="12"
              fill={row === 0 ? "#1F4BFF" : "none"}
              stroke="#12131A"
            />
          )),
        )}
      </svg>
    )
  }
  if (kind === "stamp") {
    return (
      <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#1F4BFF] font-mono text-[10px] text-[#12131A]">
        BA
      </span>
    )
  }
  const glyph = kind === "git" ? "GH" : kind === "in" ? "IN" : kind === "mail" ? "@" : "→"
  return <span className="font-display text-2xl tracking-[-0.04em] text-[#12131A]">{glyph}</span>
}

function Sticker({ sticker, name }: { sticker: StickerData; name: string }) {
  const moved = useRef(false)
  const start = useRef({ x: 0, y: 0, left: 0, top: 0 })
  const [shift, setShift] = useState({ x: 0, y: 0 })

  const className =
    "press absolute z-20 hidden h-[4.5rem] w-[4.5rem] cursor-grab touch-none items-center justify-center rounded-2xl border-[3px] border-white bg-[#F4F1EA] shadow-[4px_6px_0_rgba(0,0,0,0.35)] active:cursor-grabbing sm:flex"
  const style = {
    left: sticker.x,
    top: sticker.y,
    transform: `translate(${shift.x}px, ${shift.y}px) rotate(${sticker.rotate}deg)`,
  }

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    moved.current = false
    start.current = { x: event.clientX, y: event.clientY, left: shift.x, top: shift.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const dx = event.clientX - start.current.x
    const dy = event.clientY - start.current.y
    if (Math.hypot(dx, dy) > 4) moved.current = true
    setShift({ x: start.current.left + dx, y: start.current.top + dy })
  }

  const onClick = (event: React.MouseEvent) => {
    if (!moved.current) return
    event.preventDefault()
    moved.current = false
  }

  const inner = <Drawing kind={sticker.draw} />

  if (sticker.href === "/contact") {
    return (
      <Link
        href="/contact"
        aria-label={name}
        className={className}
        style={style}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick}
      >
        {inner}
      </Link>
    )
  }

  if (sticker.href) {
    return (
      <a
        href={sticker.href}
        aria-label={name}
        className={className}
        style={style}
        target={sticker.href.startsWith("http") ? "_blank" : undefined}
        rel={sticker.href.startsWith("http") ? "noreferrer" : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClick={onClick}
      >
        {inner}
      </a>
    )
  }

  return (
    <div
      role="img"
      aria-label={name}
      className={className}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      {inner}
    </div>
  )
}

export function StickerField() {
  const { t } = useCopy()
  return (
    <>
      {STICKERS.map((sticker) => (
        <Sticker key={sticker.id} sticker={sticker} name={t.stickers[sticker.label]} />
      ))}
    </>
  )
}

export function NoteCard() {
  const { t } = useCopy()
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  const note = t.notes[index] ?? ""

  useEffect(() => {
    if (reduced) {
      setTyped(note.length)
      return
    }
    if (typed < note.length) {
      const id = window.setTimeout(() => setTyped((current) => current + 1), 26)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => {
      setIndex((value) => (value + 1) % t.notes.length)
      setTyped(0)
    }, 1400)
    return () => window.clearTimeout(id)
  }, [note, typed, reduced, t.notes.length])

  const go = (direction: number) => {
    setIndex((value) => (value + direction + t.notes.length) % t.notes.length)
    setTyped(0)
  }

  return (
    <div className="relative mx-auto mt-8 w-[min(100%,20rem)] text-left">
      <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-2 rounded-2xl bg-[#23252f]" aria-hidden />
      <div className="absolute inset-0 -translate-x-1 translate-y-1 -rotate-2 rounded-2xl bg-[#1c1e27]" aria-hidden />
      <div className="relative rounded-2xl border border-white/10 bg-[#16171d] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F4F1EA]/55">{t.noteLabel}</p>
        <p className="mt-2 min-h-[4.5rem] font-mono text-sm leading-relaxed text-[#F4F1EA]" aria-live="polite">
          {note.slice(0, typed)}
          <span className="text-[#1F4BFF]">▍</span>
        </p>
        <div className="mt-3 flex items-center justify-between font-mono text-xs text-[#F4F1EA]/70">
          <button type="button" className="press rounded-full px-2 py-1" aria-label={t.prevNote} onClick={() => go(-1)}>
            ‹
          </button>
          <span>
            {index + 1}/{t.notes.length}
          </span>
          <button type="button" className="press rounded-full px-2 py-1" aria-label={t.nextNote} onClick={() => go(1)}>
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
