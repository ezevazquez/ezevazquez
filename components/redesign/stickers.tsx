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
import { useToast } from "./toast-provider"
import { StickerLinkDialog } from "./sticker-link-dialog"

type StickerSize = "tiny" | "small" | "medium" | "large" | "wide" | "tall" | "polaroid"
type StickerDialog = "linkedin" | "github" | "mail" | "polaroid"

type StickerData = {
  id: string
  label: keyof ReturnType<typeof useCopy>["t"]["stickers"]
  href?: string
  x: string
  y: string
  rotate: number
  asset: string
  size: StickerSize
  dialog?: StickerDialog
}
const STICKERS: StickerData[] = [
  { id: "fernet", label: "fernet", asset: "/stickers/fernet.png", size: "medium", x: "4%", y: "8%", rotate: 4 },
  { id: "git", label: "github", href: GITHUB_URL, asset: "/stickers/git.png", size: "small", x: "32%", y: "8%", rotate: -3, dialog: "github" },
  { id: "cordoba", label: "cordoba", asset: "/stickers/cba.png", size: "tall", x: "45%", y: "9%", rotate: -4 },
  { id: "jira", label: "jira", asset: "/stickers/jira.png", size: "small", x: "56%", y: "10%", rotate: 5 },
  { id: "in", label: "linkedin", href: LINKEDIN_URL, asset: "/stickers/linkedin.png", size: "small", x: "70%", y: "7%", rotate: 6, dialog: "linkedin" },
  { id: "lomito", label: "lomito", asset: "/stickers/lomito.png", size: "wide", x: "83%", y: "14%", rotate: -7 },
  { id: "pol-1", label: "polaroid", asset: "/stickers/polaroid1.png", size: "polaroid", x: "15%", y: "20%", rotate: -12, dialog: "polaroid" },
  { id: "me", label: "eze", asset: "/stickers/me.png", size: "small", x: "29%", y: "20%", rotate: -5 },
  { id: "cooper", label: "cooper", asset: "/stickers/cooper.png", size: "medium", x: "61%", y: "20%", rotate: 7 },
  { id: "mate", label: "mate", asset: "/stickers/mate.png", size: "tall", x: "4%", y: "34%", rotate: -12 },
  { id: "notion", label: "notion", asset: "/stickers/notion.png", size: "small", x: "20%", y: "47%", rotate: -9 },
  { id: "pol-2", label: "polaroid", asset: "/stickers/polaroid2.png", size: "polaroid", x: "76%", y: "32%", rotate: 7, dialog: "polaroid" },
  { id: "bass", label: "bass", asset: "/stickers/bass.png", size: "tall", x: "72%", y: "52%", rotate: -10 },
  { id: "phones", label: "phones", asset: "/stickers/headphones.png", size: "medium", x: "4%", y: "65%", rotate: -8 },
  { id: "dog", label: "dog", asset: "/stickers/dog.png", size: "medium", x: "20%", y: "62%", rotate: -6 },
  { id: "mail", label: "mail", href: EMAIL_URL, asset: "/stickers/letter.png", size: "wide", x: "13%", y: "80%", rotate: 4, dialog: "mail" },
  { id: "pol-3", label: "polaroid", asset: "/stickers/polaroid3.png", size: "polaroid", x: "31%", y: "72%", rotate: -9, dialog: "polaroid" },
  { id: "phone", label: "phone", asset: "/stickers/phone.png", size: "medium", x: "57%", y: "79%", rotate: 4 },
  { id: "lemon", label: "lemon", asset: "/stickers/lemon.png", size: "small", x: "72%", y: "76%", rotate: 6 },
  { id: "boca", label: "boca", asset: "/stickers/boca.png", size: "medium", x: "84%", y: "78%", rotate: -3 },
]

type PosMap = Record<string, { x: number; y: number }>

function getDialogContent(sticker: StickerData, t: ReturnType<typeof useCopy>["t"]) {
  switch (sticker.dialog) {
    case "github":
      return { intro: t.stickerDialog.github.intro, href: GITHUB_URL, linkLabel: t.stickerDialog.github.link }
    case "mail":
      return { intro: t.stickerDialog.mail.intro, href: EMAIL_URL, linkLabel: t.stickerDialog.mail.link }
    case "polaroid": {
      const index = Math.max(0, Number(sticker.id.split("-")[1]) - 1)
      return { intro: t.stickerDialog.polaroids[index] ?? t.stickerDialog.polaroids[0] }
    }
    case "linkedin":
    default:
      return { intro: t.stickerDialog.linkedin.intro, href: LINKEDIN_URL, linkLabel: t.stickerDialog.linkedin.link }
  }
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
    <span
      data-sticker-art
      style={SIZE_STYLES[sticker.size]}
      className="pointer-events-none block"
    >
      <Image
        src={sticker.asset}
        alt=""
        width={208}
        height={208}
        sizes="(max-width: 1023px) 0px, 208px"
        draggable={false}
        className={`h-full w-full object-contain ${playing ? "phones-on" : ""}`}
      />
    </span>
  )
}

type StickerProps = {
  sticker: StickerData
  name: string
  shift: { x: number; y: number }
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
      const baseLeft = (parseFloat(sticker.x) / 100) * parent.clientWidth
      const baseTop = (parseFloat(sticker.y) / 100) * parent.clientHeight
      return {
        x: Math.min(boardRight - baseLeft - el.offsetWidth, Math.max(boardLeft - baseLeft, x)),
        y: Math.min(boardBottom - baseTop - el.offsetHeight, Math.max(boardTop - baseTop, y)),
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
    "hidden lg:flex",
    grabbed ? "sticker-grabbed" : "",
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
        if (sticker.dialog || sticker.href) onOpen(sticker, event.currentTarget.getBoundingClientRect())
        else onActivate(sticker.id)
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return
        event.preventDefault()
        if (sticker.dialog || sticker.href) onOpen(sticker, event.currentTarget.getBoundingClientRect())
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
  const [playingId, setPlayingId] = useState<string>()
  const [activeSticker, setActiveSticker] = useState<StickerData>()
  const [dialogAnchor, setDialogAnchor] = useState<{ left: number; top: number; right: number; bottom: number; width: number }>()
  const dialogTriggerRef = useRef<HTMLElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setPlayingId(undefined)
  }, [])

  const playAudio = useCallback((id: string, source: string) => {
    stopAudio()
    const audio = new Audio(source)
    audio.volume = 0.45
    audioRef.current = audio
    setPlayingId(id)
    audio.addEventListener("ended", () => {
      if (audioRef.current === audio) {
        audioRef.current = null
        setPlayingId(undefined)
      }
    }, { once: true })
    void audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null
        setPlayingId(undefined)
      }
    })
  }, [stopAudio])

  useEffect(() => {
    const reset = () => {
      setPositions({})
      setZOrder(STICKERS.map((sticker) => sticker.id))
      setActiveSticker(undefined)
      setDialogAnchor(undefined)
      stopAudio()
    }
    window.addEventListener("eze:reset-hero", reset)
    return () => window.removeEventListener("eze:reset-hero", reset)
  }, [stopAudio])

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

  useEffect(() => stopAudio, [stopAudio])

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
        setActiveSticker(sticker)
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
    if (id === "fernet") playAudio(id, "/audio/cuarteto.mp3")
    if (id === "bass") playAudio(id, "/audio/bass.mp3")
    if (id === "phones") {
      const tracks = ["/audio/cuarteto.mp3", "/audio/bass.mp3"]
      playAudio(id, tracks[Math.floor(Math.random() * tracks.length)])
      showToast({ message: t.stickerToasts.radioPlaying, icon: "🎵", type: "radio" })
      return
    }
    const item = messages[id]
    if (item) showToast({ ...item, type: id === "mate" ? "success" : "info" })
  }, [playAudio, showToast, t])

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
            z={z}
            onShift={onShift}
            onBringFront={onBringFront}
            onActivate={onActivate}
            onOpen={onOpen}
            playing={sticker.id === playingId}
            reduced={reduced}
            zoom={zoom}
            tooltip={tooltip}
          />
        )
      })}
      {activeSticker?.dialog && (
        <StickerLinkDialog
          {...getDialogContent(activeSticker, t)}
          anchor={dialogAnchor}
          trigger={dialogTriggerRef.current}
          onClose={() => setActiveSticker(undefined)}
        />
      )}
    </>
  )
}
