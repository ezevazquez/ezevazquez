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
import { useTransitionNav } from "./transition-context"
import { playBassRiff, stopTune, toggleTune } from "@/lib/redesign/tune"

type Draw =
  | "git"
  | "in"
  | "mail"
  | "cal"
  | "mate"
  | "jira"
  | "excel"
  | "stamp"
  | "plane"
  | "phones"
  | "gummies"
  | "bass"
  | "lemon"
  | "fernet"
  | "cordoba"
  | "dog"
  | "pizza"
  | "boca"
  | "polaroid"

type StickerData = {
  id: string
  label: keyof ReturnType<typeof useCopy>["t"]["stickers"]
  href?: string
  x: string
  y: string
  rotate: number
  mobile?: boolean
  draw: Draw
  photo?: string
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
  { id: "plane", label: "plane", x: "84%", y: "8%", rotate: 12, mobile: true, draw: "plane" },
  { id: "phones", label: "phones", x: "46%", y: "78%", rotate: -8, mobile: true, draw: "phones" },
  { id: "gummies", label: "gummies", x: "3%", y: "50%", rotate: 8, mobile: true, draw: "gummies" },
  { id: "bass", label: "bass", x: "92%", y: "40%", rotate: -10, draw: "bass" },
  { id: "lemon", label: "lemon", x: "34%", y: "88%", rotate: 6, mobile: true, draw: "lemon" },
  { id: "fernet", label: "fernet", x: "58%", y: "2%", rotate: 4, mobile: true, draw: "fernet" },
  { id: "cordoba", label: "cordoba", x: "40%", y: "2%", rotate: -4, draw: "cordoba" },
  { id: "dog", label: "dog", x: "2%", y: "88%", rotate: -6, mobile: true, draw: "dog" },
  { id: "pizza", label: "pizza", x: "94%", y: "72%", rotate: 8, mobile: true, draw: "pizza" },
  { id: "boca", label: "boca", x: "62%", y: "90%", rotate: -3, mobile: true, draw: "boca" },
  { id: "pol-1", label: "polaroid", x: "18%", y: "4%", rotate: -7, draw: "polaroid", photo: "/stickers/polaroids/1.jpg" },
  { id: "pol-2", label: "polaroid", x: "78%", y: "48%", rotate: 5, draw: "polaroid", photo: "/stickers/polaroids/2.jpg" },
  { id: "pol-3", label: "polaroid", x: "28%", y: "72%", rotate: 3, mobile: true, draw: "polaroid", photo: "/stickers/polaroids/3.jpg" },
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

const ART: Record<Draw, string> = {
  git: "/stickers/git.png",
  in: "/stickers/in.png",
  mail: "/stickers/mail.png",
  cal: "/stickers/cal.png",
  mate: "/stickers/mate.png",
  jira: "/stickers/jira.png",
  excel: "/stickers/excel.png",
  stamp: "/stickers/stamp.png",
  plane: "/stickers/plane.png",
  phones: "/stickers/phones.png",
  gummies: "/stickers/gummies.png",
  bass: "/stickers/bass.png",
  lemon: "/stickers/lemon.png",
  fernet: "/stickers/fernet.png",
  cordoba: "/stickers/cordoba.png",
  dog: "/stickers/dog.png",
  pizza: "/stickers/pizza.png",
  boca: "/stickers/boca.svg",
  polaroid: "",
}

function PolaroidFrame({ src }: { src?: string }) {
  const [ready, setReady] = useState(Boolean(src))
  return (
    <div className="w-[5.6rem] bg-[#F4F1EA] p-1.5 pb-5 shadow-[4px_8px_0_rgba(0,0,0,0.4)]">
      {src && ready ? (
        <img
          src={src}
          alt=""
          draggable={false}
          className="pointer-events-none aspect-[4/5] w-full object-cover"
          onError={() => setReady(false)}
        />
      ) : (
        <div className="aspect-[4/5] w-full bg-[#23252e]" />
      )}
    </div>
  )
}

function Drawing({
  kind,
  playing,
  photo,
}: {
  kind: Draw
  steaming?: boolean
  lit?: boolean
  playing?: boolean
  photo?: string
}) {
  if (kind === "polaroid") return <PolaroidFrame src={photo} />
  const wide = kind === "plane" || kind === "jira" || kind === "dog" || kind === "pizza" || kind === "gummies"
  const tall = kind === "bass" || kind === "fernet"
  return (
    <img
      src={ART[kind]}
      alt=""
      draggable={false}
      className={`pointer-events-none object-contain ${
        kind === "dog" ? "h-24 w-52" : wide ? "h-20 w-36" : tall ? "h-32 w-16" : kind === "boca" ? "h-28 w-24" : "h-24 w-24"
      } ${playing ? "phones-on" : ""}`}
    />
  )
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
  onOpen: (href: string) => void
  steaming?: boolean
  stamped?: boolean
  lit?: boolean
  playing?: boolean
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
  onOpen,
  steaming,
  stamped,
  lit,
  playing,
  reduced,
}: StickerProps) {
  const elRef = useRef<HTMLElement | null>(null)
  const moved = useRef(false)
  const opened = useRef(false)
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
    if (elRef.current?.dataset.flying === "1") return
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
    event.preventDefault()
    moved.current = false
    dragging.current = true
    setGrabbed(true)
    onBringFront(sticker.id)
    start.current = { x: event.clientX, y: event.clientY, left: live.current.x, top: live.current.y }
    last.current = { x: event.clientX, y: event.clientY, t: performance.now() }
    velocity.current = { x: 0, y: 0 }
    event.currentTarget.setPointerCapture(event.pointerId)
    const release = () => {
      window.removeEventListener("pointerup", release)
      window.removeEventListener("pointercancel", release)
      if (!dragging.current) return
      dragging.current = false
      setGrabbed(false)
      onShift(sticker.id, { ...live.current })
      if (elRef.current) onDrop(sticker.id, elRef.current.getBoundingClientRect())
      if (!moved.current) {
        opened.current = true
        if (sticker.href) onOpen(sticker.href)
        else onActivate(sticker.id)
      } else if (!reduced && Math.hypot(velocity.current.x, velocity.current.y) > 2) {
        fling()
      }
    }
    window.addEventListener("pointerup", release)
    window.addEventListener("pointercancel", release)
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

  const className = [
    "sticker absolute touch-none cursor-grab active:cursor-grabbing",
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
    onDragStart: (event: React.DragEvent) => event.preventDefault(),
  }

  const inner = (
    <>
      <Drawing kind={sticker.draw} steaming={steaming} lit={lit} playing={playing} photo={sticker.photo} />
      {stamped && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center rotate-[-18deg] font-display text-sm tracking-widest text-[#1F4BFF]/90">
          {stampLabel}
        </span>
      )}
    </>
  )

  return (
    <div
      ref={setRef}
      role={sticker.href ? "link" : "button"}
      tabIndex={0}
      draggable={false}
      onClick={() => {
        if (moved.current) {
          moved.current = false
          return
        }
        if (opened.current) {
          opened.current = false
          return
        }
        if (sticker.href) onOpen(sticker.href)
        else onActivate(sticker.id)
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return
        event.preventDefault()
        if (sticker.href) onOpen(sticker.href)
        else onActivate(sticker.id)
      }}
      {...handlers}
    >
      {inner}
    </div>
  )
}

export function StickerField() {
  const { t } = useCopy()
  const { navigate } = useTransitionNav()
  const reduced = useReducedMotion()
  const [positions, setPositions] = useState<PosMap>({})
  const [zOrder, setZOrder] = useState<string[]>(STICKERS.map((s) => s.id))
  const [toast, setToast] = useState<string | null>(null)
  const [steaming, setSteaming] = useState(false)
  const [stamped, setStamped] = useState(false)
  const [lit, setLit] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => () => stopTune(), [])

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

  const onOpen = useCallback(
    (href: string) => {
      if (href.startsWith("/")) navigate(href)
      else if (href.startsWith("mailto:")) window.location.href = href
      else window.open(href, "_blank", "noopener,noreferrer")
    },
    [navigate],
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
      if (id === "excel") {
        setLit(true)
        showToast(t.eggExcel)
        window.setTimeout(() => setLit(false), 900)
      }
      if (id === "jira") {
        showToast(t.eggJira)
      }
      if (id === "plane") {
        const el = document.querySelector<HTMLElement>('[data-sticker="plane"]')
        if (!el || el.dataset.flying === "1") return
        el.dataset.flying = "1"
        const current = getComputedStyle(el).transform
        const fly = el.animate(
          [
            { transform: current === "none" ? "none" : current },
            { transform: "translate3d(80vw, -46vh, 0) rotate(-24deg) scale(0.45)", offset: 0.48 },
            { transform: current === "none" ? "none" : current },
          ],
          { duration: reduced ? 400 : 2400, easing: "cubic-bezier(0.45, 0, 0.2, 1)" },
        )
        fly.onfinish = () => {
          delete el.dataset.flying
        }
        showToast(t.eggPlane)
      }
      if (id === "phones") {
        void toggleTune().then((on) => {
          setPlaying(on)
          if (on) showToast(t.eggMusic)
        })
      }
      if (id === "bass") {
        void playBassRiff()
        showToast(t.eggBass)
      }
    },
    [reduced, showToast, t.eggBass, t.eggExcel, t.eggJira, t.eggMate, t.eggMusic, t.eggPlane, t.eggStamp],
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
            onOpen={onOpen}
            steaming={sticker.id === "mate" && steaming}
            stamped={sticker.id === "stamp" && stamped}
            lit={sticker.id === "excel" && lit}
            playing={sticker.id === "phones" && playing}
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
