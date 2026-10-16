"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react"
import Image from "next/image"
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants"
import { CALENDAR_URL, HAS_CALENDAR } from "@/lib/redesign/config"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { useTransitionNav } from "./transition-context"
import { playBassRiff, stopTune, toggleTune } from "@/lib/redesign/tune"
import { toggleRadio, stopRadio } from "@/lib/redesign/radio"
import { useToast } from "./toast-provider"
import { StickerLinkDialog } from "./sticker-link-dialog"

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
  dialog?: "linkedin"
}
const STICKERS: StickerData[] = [
  { id: "git", label: "github", href: GITHUB_URL, x: "5%", y: "8%", rotate: -8, draw: "git" },
  { id: "in", label: "linkedin", href: LINKEDIN_URL, x: "82%", y: "8%", rotate: 6, mobile: true, draw: "in", dialog: "linkedin" },
  { id: "mail", label: "mail", href: EMAIL_URL, x: "5%", y: "76%", rotate: 4, draw: "mail" },
  {
    id: "cal",
    label: "agenda",
    href: HAS_CALENDAR ? CALENDAR_URL : "/contact",
    x: "82%",
    y: "76%",
    rotate: -6,
    draw: "cal",
  },
  { id: "mate", label: "mate", x: "3%", y: "31%", rotate: -12, draw: "mate" },
  { id: "jira", label: "jira", x: "79%", y: "24%", rotate: 8, draw: "jira" },
  { id: "excel", label: "excel", x: "20%", y: "76%", rotate: 3, draw: "excel" },
  { id: "stamp", label: "stamp", x: "73%", y: "76%", rotate: -4, draw: "stamp" },
  { id: "plane", label: "plane", x: "87%", y: "27%", rotate: 12, draw: "plane" },
  { id: "phones", label: "phones", x: "3%", y: "60%", rotate: -8, draw: "phones" },
  { id: "gummies", label: "gummies", x: "4%", y: "49%", rotate: 8, draw: "gummies" },
  { id: "bass", label: "bass", x: "89%", y: "46%", rotate: -10, draw: "bass" },
  { id: "lemon", label: "lemon", x: "17%", y: "67%", rotate: 6, draw: "lemon" },
  { id: "fernet", label: "fernet", x: "17%", y: "3%", rotate: 4, draw: "fernet" },
  { id: "cordoba", label: "cordoba", x: "35%", y: "3%", rotate: -4, draw: "cordoba" },
  { id: "dog", label: "dog", x: "2%", y: "76%", rotate: -6, draw: "dog" },
  { id: "pizza", label: "pizza", x: "88%", y: "76%", rotate: 8, draw: "pizza" },
  { id: "boca", label: "boca", x: "87%", y: "62%", rotate: -3, mobile: true, draw: "boca" },
  { id: "pol-1", label: "polaroid", x: "22%", y: "3%", rotate: -7, draw: "polaroid" },
  { id: "pol-2", label: "polaroid", x: "78%", y: "65%", rotate: 5, draw: "polaroid" },
  { id: "pol-3", label: "polaroid", x: "15%", y: "56%", rotate: 3, draw: "polaroid" },
]

type PosMap = Record<string, { x: number; y: number }>

function playStickerSound(kind: "pick" | "drop") {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const start = kind === "pick" ? 310 : 190
    const end = kind === "pick" ? 230 : 105
    oscillator.type = "triangle"
    oscillator.frequency.setValueAtTime(start, context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(end, context.currentTime + 0.07)
    gain.gain.setValueAtTime(0.1, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.09)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.1)
    oscillator.addEventListener("ended", () => void context.close())
  } catch {
    // Audio feedback is optional.
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
  boca: "/stickers/boca.png",
  polaroid: "",
}

function PolaroidFrame({ src }: { src?: string }) {
  const [ready, setReady] = useState(Boolean(src))
  return (
    <div className="w-[5.6rem] bg-paper p-1.5 pb-5">
      {src && ready ? (
        <Image
          src={src}
          alt=""
          width={224}
          height={280}
          sizes="90px"
          draggable={false}
          className="pointer-events-none aspect-[4/5] w-full object-cover"
          onError={() => setReady(false)}
        />
      ) : (
        <div className="aspect-[4/5] w-full bg-canvas-soft" />
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
    <Image
      src={ART[kind]}
      alt=""
      width={208}
      height={128}
      sizes="(max-width: 640px) 96px, 208px"
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
  onOpen: (sticker: StickerData, anchor?: DOMRect) => void
  steaming?: boolean
  stamped?: boolean
  lit?: boolean
  playing?: boolean
  reduced: boolean
  zoom: number
  tooltip?: string
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
  zoom,
  tooltip,
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
  const [hovered, setHovered] = useState(false)

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
    (x: number, y: number) => {
      const el = elRef.current
      if (!el) return
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${sticker.rotate}deg)`
    },
    [sticker.rotate],
  )

  useEffect(() => {
    if (elRef.current?.dataset.flying === "1") return
    applyTransform(shift.x, shift.y)
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
      applyTransform(x, y)
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
    event.currentTarget.style.zIndex = "70"
    playStickerSound("pick")
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
      if (moved.current) playStickerSound("drop")
      if (!moved.current) {
        opened.current = true
        if (sticker.href) onOpen(sticker, elRef.current?.getBoundingClientRect())
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
    const dx = (event.clientX - start.current.x) / zoom
    const dy = (event.clientY - start.current.y) / zoom
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
    applyTransform(next.x, next.y)
  }

  const className = [
    "sticker absolute select-none touch-none cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal",
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
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
    onDragStart: (event: React.DragEvent) => event.preventDefault(),
  }

  const inner = (
    <>
      <Drawing kind={sticker.draw} steaming={steaming} lit={lit} playing={playing} photo={sticker.photo} />
      {stamped && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center rotate-[-18deg] font-display text-sm tracking-widest text-signal/90">
          {stampLabel}
        </span>
      )}
      {hovered && !grabbed && tooltip && (
        <span role="tooltip" className="pointer-events-none absolute -top-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-paper/20 bg-canvas/95 px-2.5 py-0.5 font-mono text-[10px] font-medium text-paper shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          {tooltip}
        </span>
      )}
    </>
  )

  return (
    <div
      ref={setRef}
      role={sticker.href && !sticker.dialog ? "link" : "button"}
      tabIndex={0}
      draggable={false}
      onClick={(event) => {
        if (moved.current) {
          moved.current = false
          return
        }
        if (opened.current) {
          opened.current = false
          return
        }
        if (sticker.href) onOpen(sticker, event.currentTarget.getBoundingClientRect())
        else onActivate(sticker.id)
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return
        event.preventDefault()
        if (sticker.href) onOpen(sticker, event.currentTarget.getBoundingClientRect())
        else onActivate(sticker.id)
      }}
      {...handlers}
    >
      {inner}
    </div>
  )
}

export function StickerField({ entered, zoom }: { entered: boolean; zoom: number }) {
  const { t } = useCopy()
  const { navigate } = useTransitionNav()
  const { showToast } = useToast()
  const reduced = useReducedMotion()
  const [positions, setPositions] = useState<PosMap>({})
  const [zOrder, setZOrder] = useState<string[]>(STICKERS.map((s) => s.id))
  const [steaming, setSteaming] = useState(false)
  const [stamped, setStamped] = useState(false)
  const [lit, setLit] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [activeDialog, setActiveDialog] = useState<StickerData["dialog"]>()
  const [dialogAnchor, setDialogAnchor] = useState<{ left: number; top: number; width: number }>()

  useEffect(() => {
    const reset = () => {
      setPositions({})
      setZOrder(STICKERS.map((sticker) => sticker.id))
    }
    window.addEventListener("eze:reset-stickers", reset)
    return () => window.removeEventListener("eze:reset-stickers", reset)
  }, [])

  useLayoutEffect(() => {
    if (!entered) return
    const stickers = Array.from(document.querySelectorAll<HTMLElement>("[data-sticker]"))
    if (reduced) {
      stickers.forEach((sticker) => {
        sticker.style.opacity = "1"
        sticker.style.scale = "1"
      })
      return
    }
    stickers.forEach((sticker, index) => {
      const animation = sticker.animate(
        [
          { opacity: 0, scale: 0.58, filter: "blur(5px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)" },
        ],
        { duration: 460, delay: 260 + index * 72, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "both" },
      )
      animation.onfinish = () => {
        sticker.style.opacity = "1"
        sticker.style.scale = "1"
        sticker.style.filter = "none"
        animation.cancel()
      }
    })
  }, [entered, reduced])

  useEffect(() => () => {
    stopRadio()
    stopTune()
  }, [])

  const onShift = useCallback((id: string, next: { x: number; y: number }) => {
    setPositions((prev) => {
      return { ...prev, [id]: next }
    })
  }, [])

  const onBringFront = useCallback((id: string) => {
    setZOrder((order) => [...order.filter((item) => item !== id), id])
  }, [])

  const onDrop = useCallback(
    (id: string, rect: DOMRect) => {
      if (id !== "jira") return
      const excel = document.querySelector<HTMLElement>('[data-sticker="excel"]')
      if (!excel) return
      const b = excel.getBoundingClientRect()
      const overlap = !(rect.right < b.left || rect.left > b.right || rect.bottom < b.top || rect.top > b.bottom)
      if (overlap) {
        showToast({
          message: t.stickerToasts.jiraExcel,
          icon: "📊",
          type: "warning",
        })
      }
    },
    [showToast, t.stickerToasts.jiraExcel],
  )

  const onOpen = useCallback(
    (sticker: StickerData, anchor?: DOMRect) => {
      if (sticker.dialog) {
        if (anchor) setDialogAnchor({ left: anchor.left, top: anchor.top, width: anchor.width })
        setActiveDialog(sticker.dialog)
        return
      }
      if (!sticker.href) return
      if (sticker.href.startsWith("/")) navigate(sticker.href)
      else if (sticker.href.startsWith("mailto:")) window.location.href = sticker.href
      else window.open(sticker.href, "_blank", "noopener,noreferrer")
    },
    [navigate],
  )

  const onActivate = useCallback(
    (id: string) => {
      if (id === "mate") {
        setSteaming(true)
        showToast({
          message: t.stickerToasts.mate,
          icon: "🧉",
          type: "success",
        })
        window.setTimeout(() => setSteaming(false), 2800)
      }
      if (id === "stamp") {
        setStamped(true)
        showToast({
          message: t.stickerToasts.stamp,
          icon: "🇦🇷",
          type: "info",
        })
        window.setTimeout(() => setStamped(false), 2400)
      }
      if (id === "excel") {
        setLit(true)
        showToast({
          message: t.stickerToasts.excel,
          icon: "📈",
          type: "info",
        })
        window.setTimeout(() => setLit(false), 900)
      }
      if (id === "jira") {
        showToast({
          message: t.stickerToasts.jira,
          icon: "🎟️",
          type: "info",
        })
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
        showToast({
          message: t.stickerToasts.plane,
          icon: "✈️",
          type: "info",
        })
      }
      if (id === "phones") {
        const { promise, action } = toggleRadio((on) => setPlaying(on))
        if (action === "play") {
          showToast({
            message: t.stickerToasts.radioTuning,
            icon: "📻",
            type: "radio",
          })
          promise.then((ok) => {
            if (ok) {
              showToast({
                message: t.stickerToasts.radioPlaying,
                icon: "🎵",
                type: "radio",
              })
            } else {
              void toggleTune().then((on) => {
                setPlaying(on)
                if (on) showToast({ message: t.eggMusic, icon: "🎵", type: "radio" })
              })
            }
          })
        } else {
          stopTune()
          showToast({
            message: t.stickerToasts.radioPaused,
            icon: "⏸",
            type: "radio",
          })
        }
      }
      if (id === "bass") {
        void playBassRiff()
        showToast({
          message: t.stickerToasts.bass,
          icon: "🎸",
          type: "info",
        })
      }
      if (id === "fernet") {
        showToast({
          message: t.stickerToasts.fernet,
          icon: "🧊",
          type: "info",
        })
      }
      if (id === "pizza") {
        showToast({
          message: t.stickerToasts.pizza,
          icon: "🍕",
          type: "info",
        })
      }
      if (id === "dog") {
        showToast({
          message: t.stickerToasts.dog,
          icon: "🐶",
          type: "info",
        })
      }
      if (id === "boca") {
        showToast({
          message: t.stickerToasts.boca,
          icon: "⚽",
          type: "info",
        })
      }
      if (id === "gummies") {
        showToast({
          message: t.stickerToasts.gummies,
          icon: "🍬",
          type: "info",
        })
      }
      if (id === "lemon") {
        showToast({
          message: t.stickerToasts.lemon,
          icon: "🍋",
          type: "info",
        })
      }
      if (id === "cordoba") {
        showToast({
          message: t.stickerToasts.cordoba,
          icon: "🏛️",
          type: "info",
        })
      }
    },
    [reduced, showToast, t],
  )

  return (
    <>
      {STICKERS.map((sticker) => {
        const z = 40 + zOrder.indexOf(sticker.id)
        const shift = positions[sticker.id] ?? { x: 0, y: 0 }
        const tooltip = t.stickerHints[sticker.id as keyof typeof t.stickerHints]
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
            zoom={zoom}
            tooltip={tooltip}
          />
        )
      })}
      {activeDialog === "linkedin" && (
        <StickerLinkDialog href={LINKEDIN_URL} anchor={dialogAnchor} onClose={() => setActiveDialog(undefined)} />
      )}
    </>
  )
}
