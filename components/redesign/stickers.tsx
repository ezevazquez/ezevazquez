"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants"
import { CALENDAR_URL, HAS_CALENDAR, STICKER_STORAGE_KEY } from "@/lib/redesign/config"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { TransitionLink } from "./transition-link"

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
  {
    id: "cal",
    label: "agenda",
    href: HAS_CALENDAR ? CALENDAR_URL : "/contact",
    x: "76%",
    y: "64%",
    rotate: -6,
    mobile: true,
    draw: "cal",
  },
  { id: "mate", label: "mate", x: "18%", y: "40%", rotate: -12, mobile: true, draw: "mate" },
  { id: "jira", label: "jira", x: "80%", y: "36%", rotate: 8, mobile: true, draw: "jira" },
  { id: "excel", label: "excel", x: "14%", y: "84%", rotate: 3, mobile: true, draw: "excel" },
  { id: "stamp", label: "stamp", x: "68%", y: "80%", rotate: -4, mobile: true, draw: "stamp" },
]

type PosMap = Record<string, { x: number; y: number }>

function loadPositions(): PosMap {
  try {
    const raw = localStorage.getItem(STICKER_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PosMap
  } catch {
    return {}
  }
}

function savePositions(map: PosMap) {
  try {
    localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

function Drawing({ kind, steaming }: { kind: Draw; steaming?: boolean }) {
  if (kind === "mate") {
    return (
      <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden>
        <path
          d="M18 22h22v16a12 12 0 0 1-12 12h-2a10 10 0 0 1-10-10V22z"
          fill="none"
          stroke="#12131A"
          strokeWidth="2"
        />
        <path d="M40 28h6a6 6 0 0 1 0 12h-6" fill="none" stroke="#12131A" strokeWidth="2" />
        <path
          d="M28 14c2 4 2 4 0 8M34 12c2 4 2 4 0 8"
          className={steaming ? "mate-steam" : undefined}
          fill="none"
          stroke="#1F4BFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
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

type StickerProps = {
  sticker: StickerData
  name: string
  stampLabel: string
  shift: { x: number; y: number }
  z: number
  onShift: (id: string, next: { x: number; y: number }) => void
  onBringFront: (id: string) => void
  onDrop: (id: string, rect: DOMRect) => void
  onActivate: (id: string) => void
  steaming?: boolean
  stamped?: boolean
  reduced: boolean
}

function Sticker({
  sticker,
  name,
  stampLabel,
  shift,
  z,
  onShift,
  onBringFront,
  onDrop,
  onActivate,
  steaming,
  stamped,
  reduced,
}: StickerProps) {
  const elRef = useRef<HTMLElement | null>(null)
  const moved = useRef(false)
  const dragging = useRef(false)
  const live = useRef({ x: shift.x, y: shift.y })
  const start = useRef({ x: 0, y: 0, left: 0, top: 0 })
  const last = useRef({ x: 0, y: 0, t: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const raf = useRef(0)
  const [grabbed, setGrabbed] = useState(false)

  useEffect(() => {
    live.current = { x: shift.x, y: shift.y }
  }, [shift])

  const clampToParent = useCallback(
    (x: number, y: number) => {
      const el = elRef.current
      const parent = el?.offsetParent as HTMLElement | null
      if (!el || !parent) return { x, y }
      const maxX = parent.clientWidth - el.offsetWidth
      const maxY = parent.clientHeight - el.offsetHeight
      const baseLeft = (parseFloat(sticker.x) / 100) * parent.clientWidth
      const baseTop = (parseFloat(sticker.y) / 100) * parent.clientHeight
      return {
        x: Math.min(maxX - baseLeft, Math.max(-baseLeft, x)),
        y: Math.min(maxY - baseTop, Math.max(-baseTop, y)),
      }
    },
    [sticker.x, sticker.y],
  )

  const applyTransform = useCallback(
    (x: number, y: number, scale = 1) => {
      const el = elRef.current
      if (!el) return
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${sticker.rotate}deg) scale(${scale})`
    },
    [sticker.rotate],
  )

  useEffect(() => {
    applyTransform(shift.x, shift.y, grabbed ? 1.08 : 1)
  }, [shift, grabbed, applyTransform])

  const fling = useCallback(() => {
    if (reduced) return
    cancelAnimationFrame(raf.current)
    let x = live.current.x
    let y = live.current.y
    let vx = velocity.current.x
    let vy = velocity.current.y
    const tick = () => {
      vx *= 0.92
      vy *= 0.92
      const next = clampToParent(x + vx, y + vy)
      x = next.x
      y = next.y
      live.current = { x, y }
      applyTransform(x, y, 1)
      if (Math.hypot(vx, vy) > 0.4) {
        raf.current = requestAnimationFrame(tick)
      } else {
        onShift(sticker.id, { x, y })
      }
    }
    raf.current = requestAnimationFrame(tick)
  }, [applyTransform, clampToParent, onShift, reduced, sticker.id])

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    moved.current = false
    dragging.current = true
    setGrabbed(true)
    onBringFront(sticker.id)
    start.current = { x: event.clientX, y: event.clientY, left: live.current.x, top: live.current.y }
    last.current = { x: event.clientX, y: event.clientY, t: performance.now() }
    velocity.current = { x: 0, y: 0 }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragging.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return
    const dx = event.clientX - start.current.x
    const dy = event.clientY - start.current.y
    if (Math.hypot(dx, dy) > 4) moved.current = true
    const next = clampToParent(start.current.left + dx, start.current.top + dy)
    const now = performance.now()
    const dt = Math.max(1, now - last.current.t)
    velocity.current = {
      x: ((event.clientX - last.current.x) / dt) * 16,
      y: ((event.clientY - last.current.y) / dt) * 16,
    }
    last.current = { x: event.clientX, y: event.clientY, t: now }
    live.current = next
    applyTransform(next.x, next.y, 1.08)
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragging.current) return
    dragging.current = false
    setGrabbed(false)
    onShift(sticker.id, { ...live.current })
    if (elRef.current) onDrop(sticker.id, elRef.current.getBoundingClientRect())
    if (!reduced && Math.hypot(velocity.current.x, velocity.current.y) > 2) {
      fling()
    }
    window.setTimeout(() => {
      moved.current = false
    }, 0)
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      /* ignore */
    }
  }

  const onClick = (event: React.MouseEvent) => {
    if (!moved.current) return
    event.preventDefault()
    event.stopPropagation()
  }

  const className = [
    "sticker press absolute touch-none items-center justify-center rounded-2xl border-[3px] border-white bg-[#F4F1EA]",
    "h-[4.5rem] w-[4.5rem] cursor-grab active:cursor-grabbing",
    sticker.mobile ? "flex" : "hidden sm:flex",
    grabbed ? "sticker-grabbed" : "",
    stamped ? "sticker-stamped" : "",
  ]
    .filter(Boolean)
    .join(" ")

  const style: CSSProperties = {
    left: sticker.x,
    top: sticker.y,
    zIndex: z,
    transform: `translate3d(${shift.x}px, ${shift.y}px, 0) rotate(${sticker.rotate}deg)`,
  }

  const setRef = (node: HTMLElement | null) => {
    elRef.current = node
  }

  const handlers = {
    className,
    style,
    "aria-label": name,
    "data-sticker": sticker.id,
    "data-rotate": String(sticker.rotate),
    "data-cursor": "drag" as const,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onClick,
    onDoubleClick: () => onActivate(sticker.id),
  }

  const inner = (
    <>
      <Drawing kind={sticker.draw} steaming={steaming} />
      {stamped && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center rotate-[-18deg] font-display text-sm tracking-widest text-[#1F4BFF]/90">
          {stampLabel}
        </span>
      )}
    </>
  )

  if (sticker.href === "/contact") {
    return (
      <TransitionLink href="/contact" ref={setRef} {...handlers}>
        {inner}
      </TransitionLink>
    )
  }

  if (sticker.href) {
    const external = sticker.href.startsWith("http")
    return (
      <a
        ref={setRef}
        href={sticker.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        {...handlers}
      >
        {inner}
      </a>
    )
  }

  return (
    <div ref={setRef} role="img" {...handlers}>
      {inner}
    </div>
  )
}

export function StickerField() {
  const { t } = useCopy()
  const reduced = useReducedMotion()
  const [positions, setPositions] = useState<PosMap>({})
  const [zOrder, setZOrder] = useState<string[]>(STICKERS.map((s) => s.id))
  const [toast, setToast] = useState<string | null>(null)
  const [steaming, setSteaming] = useState(false)
  const [stamped, setStamped] = useState(false)

  useEffect(() => {
    setPositions(loadPositions())
  }, [])

  const onShift = useCallback((id: string, next: { x: number; y: number }) => {
    setPositions((prev) => {
      const map = { ...prev, [id]: next }
      savePositions(map)
      return map
    })
  }, [])

  const onBringFront = useCallback((id: string) => {
    setZOrder((order) => [...order.filter((item) => item !== id), id])
  }, [])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const onDrop = useCallback(
    (id: string, rect: DOMRect) => {
      if (id !== "jira") return
      const excel = document.querySelector<HTMLElement>('[data-sticker="excel"]')
      if (!excel) return
      const b = excel.getBoundingClientRect()
      const overlap = !(rect.right < b.left || rect.left > b.right || rect.bottom < b.top || rect.top > b.bottom)
      if (overlap) showToast(t.eggTicket)
    },
    [showToast, t.eggTicket],
  )

  const onActivate = useCallback(
    (id: string) => {
      if (id === "mate") {
        setSteaming(true)
        showToast(t.eggMate)
        window.setTimeout(() => setSteaming(false), 2800)
      }
      if (id === "stamp") {
        setStamped(true)
        showToast(t.eggStamp)
        window.setTimeout(() => setStamped(false), 2400)
      }
    },
    [showToast, t.eggMate, t.eggStamp],
  )

  return (
    <>
      {STICKERS.map((sticker) => {
        const z = 20 + zOrder.indexOf(sticker.id)
        const shift = positions[sticker.id] ?? { x: 0, y: 0 }
        return (
          <Sticker
            key={sticker.id}
            sticker={sticker}
            name={t.stickers[sticker.label]}
            stampLabel={t.eggStamp}
            shift={shift}
            z={z}
            onShift={onShift}
            onBringFront={onBringFront}
            onDrop={onDrop}
            onActivate={onActivate}
            steaming={sticker.id === "mate" && steaming}
            stamped={sticker.id === "stamp" && stamped}
            reduced={reduced}
          />
        )
      })}
      {toast && (
        <div
          role="status"
          className="pointer-events-none absolute left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-[#1F4BFF] px-4 py-2 font-mono text-xs text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </>
  )
}

export function NoteCard() {
  const { t } = useCopy()
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  const [paused, setPaused] = useState(false)
  const note = t.notes[index] ?? ""

  useEffect(() => {
    if (reduced) {
      setTyped(note.length)
      return
    }
    if (paused) return
    if (typed < note.length) {
      const id = window.setTimeout(() => setTyped((current) => current + 1), 26)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => {
      setIndex((value) => (value + 1) % t.notes.length)
      setTyped(0)
    }, 1400)
    return () => window.clearTimeout(id)
  }, [note, typed, reduced, t.notes.length, paused])

  const go = (direction: number) => {
    setIndex((value) => (value + direction + t.notes.length) % t.notes.length)
    setTyped(0)
  }

  return (
    <div
      className="relative mx-auto mt-8 w-[min(100%,20rem)] text-left"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false)
      }}
    >
      <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-2 rounded-2xl bg-[#23252f]" aria-hidden />
      <div className="absolute inset-0 -translate-x-1 translate-y-1 -rotate-2 rounded-2xl bg-[#1c1e27]" aria-hidden />
      <div className="relative rounded-2xl border border-white/10 bg-[#16171d] p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F4F1EA]/55">{t.noteLabel}</p>
          <button
            type="button"
            className="press rounded-full px-2 py-0.5 font-mono text-[10px] text-[#F4F1EA]/70"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? t.notePlay : t.notePause}
          </button>
        </div>
        <p className="mt-2 min-h-[4.5rem] font-mono text-sm leading-relaxed text-[#F4F1EA]" aria-hidden>
          {reduced ? note : note.slice(0, typed)}
          <span className="text-[#1F4BFF]">▍</span>
        </p>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {note}
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
