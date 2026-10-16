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
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { useTransitionNav } from "./transition-context"
import { playBassRiff, stopTune, toggleTune } from "@/lib/redesign/tune"
import { toggleRadio, stopRadio } from "@/lib/redesign/radio"
import { useToast } from "./toast-provider"
import { StickerLinkDialog } from "./sticker-link-dialog"

type StickerSize = "tiny" | "small" | "medium" | "large" | "wide" | "tall" | "polaroid"

type StickerData = {
  id: string
  label: keyof ReturnType<typeof useCopy>["t"]["stickers"]
  href?: string
  x: string
  y: string
  rotate: number
  mobile?: boolean
  asset: string
  size: StickerSize
  dialog?: "linkedin"
}
const STICKERS: StickerData[] = [
  { id: "git", label: "github", href: GITHUB_URL, asset: "/stickers/git.png", size: "small", x: "4%", y: "8%", rotate: -8 },
  { id: "in", label: "linkedin", href: LINKEDIN_URL, asset: "/stickers/linkedin.png", size: "medium", x: "83%", y: "7%", rotate: 6, mobile: true, dialog: "linkedin" },
  { id: "mail", label: "mail", href: EMAIL_URL, asset: "/stickers/letter.png", size: "wide", x: "30%", y: "80%", rotate: 4 },
  { id: "mate", label: "mate", asset: "/stickers/mate.png", size: "tall", x: "3%", y: "31%", rotate: -12 },
  { id: "jira", label: "jira", asset: "/stickers/jira.png", size: "small", x: "90%", y: "22%", rotate: 8 },
  { id: "phones", label: "phones", asset: "/stickers/headphones.png", size: "medium", x: "3%", y: "62%", rotate: -8 },
  { id: "bass", label: "bass", asset: "/stickers/bass.png", size: "tall", x: "90%", y: "60%", rotate: -10 },
  { id: "lemon", label: "lemon", asset: "/stickers/lemon.png", size: "small", x: "58%", y: "2%", rotate: 6 },
  { id: "fernet", label: "fernet", asset: "/stickers/fernet.png", size: "medium", x: "15%", y: "3%", rotate: 4 },
  { id: "cordoba", label: "cordoba", asset: "/stickers/cba.png", size: "tall", x: "43%", y: "1%", rotate: -4 },
  { id: "dog", label: "dog", asset: "/stickers/dog.png", size: "medium", x: "15%", y: "74%", rotate: -6 },
  { id: "boca", label: "boca", asset: "/stickers/boca.png", size: "medium", x: "83%", y: "47%", rotate: -3, mobile: true },
  { id: "cooper", label: "cooper", asset: "/stickers/cooper.png", size: "medium", x: "3%", y: "46%", rotate: 7 },
  { id: "lomito", label: "lomito", asset: "/stickers/lomito.png", size: "wide", x: "82%", y: "34%", rotate: -5 },
  { id: "notion", label: "notion", asset: "/stickers/notion.png", size: "tiny", x: "15%", y: "23%", rotate: -9 },
  { id: "phone", label: "phone", asset: "/stickers/phone.png", size: "medium", x: "64%", y: "80%", rotate: 9 },
  { id: "me", label: "eze", asset: "/stickers/me.png", size: "small", x: "15%", y: "50%", rotate: -5 },
  { id: "pol-1", label: "polaroid", asset: "/stickers/polaroid1.png", size: "polaroid", x: "28%", y: "2%", rotate: -12 },
  { id: "pol-2", label: "polaroid", asset: "/stickers/polaroid2.png", size: "polaroid", x: "75%", y: "68%", rotate: 9 },
  { id: "pol-3", label: "polaroid", asset: "/stickers/polaroid3.png", size: "polaroid", x: "73%", y: "2%", rotate: -4 },
]

type PosMap = Record<string, { x: number; y: number }>
type LayoutMap = Record<string, { x: number; y: number }>

function packStickers(): LayoutMap {
  const stickers = Array.from(document.querySelectorAll<HTMLElement>("[data-sticker]"))
  const parent = stickers[0]?.offsetParent as HTMLElement | null
  if (!parent || !stickers.length) return {}

  const width = parent.clientWidth
  const height = parent.clientHeight
  const parentRect = parent.getBoundingClientRect()
  const zoom = parentRect.width / width || 1
  const toLocalRect = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    return {
      left: (rect.left - parentRect.left) / zoom,
      top: (rect.top - parentRect.top) / zoom,
      right: (rect.right - parentRect.left) / zoom,
      bottom: (rect.bottom - parentRect.top) / zoom,
    }
  }
  const centerX = width / 2
  const centerY = height / 2
  const card = document.querySelector<HTMLElement>("[data-hero-deck]")
  const terminal = document.querySelector<HTMLElement>("[data-agent-terminal]")
  const exclusions = [
    ...(card ? [toLocalRect(card)] : [{ left: centerX - 264, right: centerX + 264, top: centerY - 224, bottom: centerY + 224 }]),
    ...(terminal ? [toLocalRect(terminal)] : []),
  ]
  const ordered = stickers
    .map((element) => {
      const sticker = STICKERS.find(({ id }) => id === element.dataset.sticker)
      return sticker ? { element, sticker, width: element.offsetWidth, height: element.offsetHeight } : null
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => b.width * b.height - a.width * a.height)

  for (const gap of [18, 10, 4, 0]) {
    const placed: Array<{ left: number; top: number; right: number; bottom: number }> = []
    const result: LayoutMap = {}
    for (const { sticker, width: itemWidth, height: itemHeight } of ordered) {
      const preferredX = (parseFloat(sticker.x) / 100) * width
      const preferredY = (parseFloat(sticker.y) / 100) * height
      let best: { x: number; y: number; score: number } | undefined
      for (let y = 64; y <= height - itemHeight - 48; y += 8) {
        for (let x = 16; x <= width - itemWidth - 16; x += 8) {
          const box = { left: x - gap, top: y - gap, right: x + itemWidth + gap, bottom: y + itemHeight + gap }
          if (exclusions.some((area) => box.left < area.right && box.right > area.left && box.top < area.bottom && box.bottom > area.top)) continue
          if (placed.some((area) => box.left < area.right && box.right > area.left && box.top < area.bottom && box.bottom > area.top)) continue
          const score = Math.hypot((x - preferredX) * 0.85, y - preferredY)
          if (!best || score < best.score) best = { x, y, score }
        }
      }
      if (!best) break
      result[sticker.id] = { x: best.x, y: best.y }
      placed.push({ left: best.x - gap, top: best.y - gap, right: best.x + itemWidth + gap, bottom: best.y + itemHeight + gap })
    }
    if (Object.keys(result).length === ordered.length) {
      return result
    }
  }

  return {}
}

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

const SIZE_STYLES: Record<StickerSize, CSSProperties> = {
  tiny: { width: "clamp(64px, min(5vw, 10vh), 80px)", height: "clamp(64px, min(5vw, 10vh), 80px)" },
  small: { width: "clamp(80px, min(7vw, 14vh), 112px)", height: "clamp(80px, min(7vw, 14vh), 112px)" },
  medium: { width: "clamp(96px, min(8.5vw, 16vh), 144px)", height: "clamp(96px, min(8.5vw, 16vh), 144px)" },
  large: { width: "clamp(112px, min(10vw, 18vh), 160px)", height: "clamp(112px, min(10vw, 18vh), 160px)" },
  wide: { width: "clamp(128px, min(11vw, 20vh), 176px)", height: "clamp(80px, min(7vw, 13vh), 112px)" },
  tall: { width: "clamp(96px, min(8vw, 15vh), 128px)", height: "clamp(128px, min(11vw, 22vh), 176px)" },
  polaroid: { width: "clamp(144px, min(14vw, 24vh), 208px)", height: "clamp(176px, min(17vw, 30vh), 256px)" },
}

function Drawing({ sticker, playing }: { sticker: StickerData; playing?: boolean }) {
  return (
    <Image
      src={sticker.asset}
      alt=""
      width={208}
      height={208}
      sizes="(max-width: 640px) 96px, 128px"
      draggable={false}
      style={SIZE_STYLES[sticker.size]}
      className={`pointer-events-none object-contain ${playing ? "phones-on" : ""}`}
    />
  )
}

type StickerProps = {
  sticker: StickerData
  name: string
  shift: { x: number; y: number }
  basePosition?: { x: number; y: number }
  layoutReady: boolean
  z: number
  onShift: (id: string, next: { x: number; y: number }) => void
  onBringFront: (id: string) => void
  onActivate: (id: string) => void
  onOpen: (sticker: StickerData, anchor?: DOMRect) => void
  playing?: boolean
  reduced: boolean
  zoom: number
  tooltip?: string
}

function Sticker({
  sticker,
  name,
  shift,
  basePosition,
  layoutReady,
  z,
  onShift,
  onBringFront,
  onActivate,
  onOpen,
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
      const boardLeft = -parent.clientWidth * 0.5
      const boardTop = -parent.clientHeight * 0.5
      const boardRight = parent.clientWidth * 1.5
      const boardBottom = parent.clientHeight * 1.5
      const baseLeft = basePosition?.x ?? (parseFloat(sticker.x) / 100) * parent.clientWidth
      const baseTop = basePosition?.y ?? (parseFloat(sticker.y) / 100) * parent.clientHeight
      return {
        x: Math.min(boardRight - baseLeft - el.offsetWidth, Math.max(boardLeft - baseLeft, x)),
        y: Math.min(boardBottom - baseTop - el.offsetHeight, Math.max(boardTop - baseTop, y)),
      }
    },
    [basePosition, sticker.x, sticker.y],
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
    event.currentTarget.style.transformOrigin = `${event.nativeEvent.offsetX}px ${event.nativeEvent.offsetY}px`
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
    sticker.mobile ? "flex" : "hidden lg:flex",
    layoutReady && !basePosition ? "invisible" : "",
    grabbed ? "sticker-grabbed" : "",
  ]
    .filter(Boolean)
    .join(" ")

  const style: CSSProperties = {
    left: basePosition ? `${basePosition.x}px` : sticker.x,
    top: basePosition ? `${basePosition.y}px` : sticker.y,
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
      <Drawing sticker={sticker} playing={playing} />
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
  const [layout, setLayout] = useState<LayoutMap>({})
  const [layoutReady, setLayoutReady] = useState(false)
  const [zOrder, setZOrder] = useState<string[]>(STICKERS.map((s) => s.id))
  const [playing, setPlaying] = useState(false)
  const [activeDialog, setActiveDialog] = useState<StickerData["dialog"]>()
  const [dialogAnchor, setDialogAnchor] = useState<{ left: number; top: number; right: number; bottom: number; width: number }>()
  const dialogTriggerRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const updateLayout = () => {
      if (window.innerWidth < 1024) {
        setLayout({})
        setLayoutReady(false)
        return
      }
      setPositions({})
      const nextLayout = packStickers()
      setLayout(nextLayout)
      setLayoutReady(Object.keys(nextLayout).length === STICKERS.length)
    }
    updateLayout()
    window.addEventListener("resize", updateLayout)
    return () => window.removeEventListener("resize", updateLayout)
  }, [])

  useEffect(() => {
    const reset = () => {
      setPositions({})
      setZOrder(STICKERS.map((sticker) => sticker.id))
      setPlaying(false)
      setActiveDialog(undefined)
      setDialogAnchor(undefined)
      stopRadio()
      stopTune()
    }
    window.addEventListener("eze:reset-hero", reset)
    return () => window.removeEventListener("eze:reset-hero", reset)
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

  const onOpen = useCallback(
    (sticker: StickerData, anchor?: DOMRect) => {
      if (sticker.dialog) {
        dialogTriggerRef.current = document.querySelector<HTMLElement>(`[data-sticker="${sticker.id}"]`)
        if (anchor) setDialogAnchor({ left: anchor.left, top: anchor.top, right: anchor.right, bottom: anchor.bottom, width: anchor.width })
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

  const onActivate = useCallback((id: string) => {
    const messages: Record<string, { message: string; icon: string }> = {
      mate: { message: t.stickerToasts.mate, icon: "🧉" },
      jira: { message: t.stickerToasts.jira, icon: "🎟️" },
      bass: { message: t.stickerToasts.bass, icon: "🎸" },
      fernet: { message: t.stickerToasts.fernet, icon: "🧊" },
      dog: { message: t.stickerToasts.dog, icon: "🐶" },
      cooper: { message: t.stickerToasts.cooper, icon: "🐶" },
      lomito: { message: t.stickerToasts.lomito, icon: "🥪" },
      notion: { message: t.stickerToasts.notion, icon: "🗒️" },
      phone: { message: t.stickerToasts.phone, icon: "☎️" },
      me: { message: t.stickerToasts.me, icon: "👋" },
      boca: { message: t.stickerToasts.boca, icon: "⚽" },
      lemon: { message: t.stickerToasts.lemon, icon: "🍋" },
      cordoba: { message: t.stickerToasts.cordoba, icon: "🏛️" },
    }
    if (id === "phones") {
      const { promise, action } = toggleRadio((on) => setPlaying(on))
      if (action === "play") {
        showToast({ message: t.stickerToasts.radioTuning, icon: "📻", type: "radio" })
        promise.then((ok) => {
          if (ok) showToast({ message: t.stickerToasts.radioPlaying, icon: "🎵", type: "radio" })
          else void toggleTune().then((on) => {
            setPlaying(on)
            if (on) showToast({ message: t.eggMusic, icon: "🎵", type: "radio" })
          })
        })
      } else {
        stopTune()
        showToast({ message: t.stickerToasts.radioPaused, icon: "⏸", type: "radio" })
      }
      return
    }
    if (id === "bass") void playBassRiff()
    const item = messages[id]
    if (item) showToast({ ...item, type: id === "mate" ? "success" : "info" })
  }, [showToast, t])

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
            shift={shift}
            basePosition={layout[sticker.id]}
            layoutReady={layoutReady}
            z={z}
            onShift={onShift}
            onBringFront={onBringFront}
            onActivate={onActivate}
            onOpen={onOpen}
            playing={sticker.id === "phones" && playing}
            reduced={reduced}
            zoom={zoom}
            tooltip={tooltip}
          />
        )
      })}
      {activeDialog === "linkedin" && (
        <StickerLinkDialog
          href={LINKEDIN_URL}
          anchor={dialogAnchor}
          trigger={dialogTriggerRef.current}
          onClose={() => setActiveDialog(undefined)}
        />
      )}
    </>
  )
}
