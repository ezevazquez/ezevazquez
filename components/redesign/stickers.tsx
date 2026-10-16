"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react"
import Image from "next/image"
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants"
import { CALENDAR_URL, HAS_CALENDAR, STICKER_STORAGE_KEY } from "@/lib/redesign/config"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { useTransitionNav } from "./transition-context"
import { playBassRiff, stopTune, toggleTune } from "@/lib/redesign/tune"
import { toggleRadio, stopRadio } from "@/lib/redesign/radio"
import { useToast } from "./toast-provider"

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

const TOOLTIPS: Record<string, { es: string; en: string }> = {
  git: { es: "GitHub · Código & Repos", en: "GitHub · Code & Repos" },
  in: { es: "LinkedIn · Conectar", en: "LinkedIn · Connect" },
  mail: { es: "Mail · Contacto directo", en: "Mail · Direct contact" },
  cal: { es: "Agenda · Reservar llamada", en: "Calendar · Book a call" },
  mate: { es: "Mate · Clic para cebar", en: "Mate · Click to brew" },
  jira: { es: "Jira · Arrastralo a Excel", en: "Jira · Drag me to Excel" },
  excel: { es: "Excel · Matriz operativa", en: "Excel · Operational matrix" },
  stamp: { es: "Buenos Aires · GMT-3", en: "Buenos Aires · GMT-3" },
  plane: { es: "Avión · Despegar a producción", en: "Plane · Takeoff to prod" },
  phones: { es: "Auriculares · Radio Lo-Fi en vivo", en: "Headphones · Live Lo-Fi Radio" },
  gummies: { es: "Gomitas · Azúcar para deployar", en: "Gummies · Brain fuel" },
  bass: { es: "Bajo · Riff en vivo", en: "Bass · Live bass riff" },
  lemon: { es: "Limón · Ácido pero necesario", en: "Lemon · Fresh & sharp" },
  fernet: { es: "Fernet · 70/30 con hielo", en: "Fernet · 70/30 on the rocks" },
  cordoba: { es: "Córdoba · La Docta", en: "Córdoba · La Docta" },
  dog: { es: "Salchicha · Guardián del sprint", en: "Dachshund · Sprint guardian" },
  pizza: { es: "Pizza · Combustible de nocturnas", en: "Pizza · Late night fuel" },
  boca: { es: "Boca · Esto es Boca", en: "Boca · Esto es Boca" },
  "pol-1": { es: "Polaroid · Memoria de equipo", en: "Polaroid · Team memory" },
  "pol-2": { es: "Polaroid · Buenos Aires", en: "Polaroid · Buenos Aires" },
  "pol-3": { es: "Polaroid · Setup", en: "Polaroid · Desk setup" },
}

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
    <div className="w-[5.6rem] bg-paper p-1.5 pb-5 shadow-[4px_8px_0_rgba(0,0,0,0.4)]">
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
  onOpen: (href: string) => void
  steaming?: boolean
  stamped?: boolean
  lit?: boolean
  playing?: boolean
  reduced: boolean
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
    "sticker absolute touch-none cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal",
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
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-canvas/95 px-2.5 py-0.5 font-mono text-[10px] font-medium text-white shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 z-50">
          {tooltip}
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
  const { t, language } = useCopy()
  const { navigate } = useTransitionNav()
  const { showToast } = useToast()
  const reduced = useReducedMotion()
  const [positions, setPositions] = useState<PosMap>({})
  const [zOrder, setZOrder] = useState<string[]>(STICKERS.map((s) => s.id))
  const [steaming, setSteaming] = useState(false)
  const [stamped, setStamped] = useState(false)
  const [lit, setLit] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => () => {
    stopRadio()
    stopTune()
  }, [])

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

  const onDrop = useCallback(
    (id: string, rect: DOMRect) => {
      if (id !== "jira") return
      const excel = document.querySelector<HTMLElement>('[data-sticker="excel"]')
      if (!excel) return
      const b = excel.getBoundingClientRect()
      const overlap = !(rect.right < b.left || rect.left > b.right || rect.bottom < b.top || rect.top > b.bottom)
      if (overlap) {
        showToast({
          message: language === "es" ? "Ticket importado a Excel: la pesadilla de todo PM 📊" : "Jira ticket dropped into Excel: PM nightmare 📊",
          icon: "📊",
          type: "warning",
        })
      }
    },
    [showToast, language],
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
        showToast({
          message: language === "es" ? "Mate cebado 🧉 (+10 foco técnico)" : "Mate brewed 🧉 (+10 focus)",
          icon: "🧉",
          type: "success",
        })
        window.setTimeout(() => setSteaming(false), 2800)
      }
      if (id === "stamp") {
        setStamped(true)
        showToast({
          message: language === "es" ? "Sellado con pasaporte porteño 🇦🇷" : "Stamped in Buenos Aires 🇦🇷",
          icon: "🇦🇷",
          type: "info",
        })
        window.setTimeout(() => setStamped(false), 2400)
      }
      if (id === "excel") {
        setLit(true)
        showToast({
          message: language === "es" ? "VLOOKUP funcionando de milagro 📈" : "VLOOKUP working by a miracle 📈",
          icon: "📈",
          type: "info",
        })
        window.setTimeout(() => setLit(false), 900)
      }
      if (id === "jira") {
        showToast({
          message: language === "es" ? "Ticket movido a 'In Progress' 🎟️" : "Ticket moved to 'In Progress' 🎟️",
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
          message: language === "es" ? "Vuelo despegado rumbo a producción ✈️" : "Takeoff to production deployed ✈️",
          icon: "✈️",
          type: "info",
        })
      }
      if (id === "phones") {
        const { promise, action } = toggleRadio((on) => setPlaying(on))
        if (action === "play") {
          showToast({
            message: language === "es" ? "Sintonizando Radio Lo-Fi... 📻" : "Tuning in to Lo-Fi radio... 📻",
            icon: "📻",
            type: "radio",
          })
          promise.then((ok) => {
            if (ok) {
              showToast({
                message: language === "es" ? "Sonando Radio Lo-Fi en vivo 🎵" : "Playing Live Lo-Fi Radio 🎵",
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
            message: language === "es" ? "Radio pausada ⏸" : "Radio paused ⏸",
            icon: "⏸",
            type: "radio",
          })
        }
      }
      if (id === "bass") {
        void playBassRiff()
        showToast({
          message: language === "es" ? "Riff de bajo slappeado 🎸" : "Slapped bass riff 🎸",
          icon: "🎸",
          type: "info",
        })
      }
      if (id === "fernet") {
        showToast({
          message: language === "es" ? "70/30 con hielo. Listo para deployar 🧊" : "Fernet 70/30 on the rocks 🧊",
          icon: "🧊",
          type: "info",
        })
      }
      if (id === "pizza") {
        showToast({
          message: language === "es" ? "Porción de muzzarella para la nocturna 🍕" : "Slice of pizza for the late shift 🍕",
          icon: "🍕",
          type: "info",
        })
      }
      if (id === "dog") {
        showToast({
          message: language === "es" ? "Salchicha guardián del sprint 🌭🐶" : "Dachshund sprint guardian 🌭🐶",
          icon: "🐶",
          type: "info",
        })
      }
      if (id === "boca") {
        showToast({
          message: "Esto es Boca 💙💛💙",
          icon: "⚽",
          type: "info",
        })
      }
      if (id === "gummies") {
        showToast({
          message: language === "es" ? "Gomitas de eucalipto para el cerebro 🍬" : "Gummies for the brain 🍬",
          icon: "🍬",
          type: "info",
        })
      }
      if (id === "lemon") {
        showToast({
          message: language === "es" ? "Limón ácido pero fresco 🍋" : "Fresh & sharp lemon 🍋",
          icon: "🍋",
          type: "info",
        })
      }
      if (id === "cordoba") {
        showToast({
          message: "Córdoba · La Docta 🏛️",
          icon: "🏛️",
          type: "info",
        })
      }
    },
    [reduced, showToast, language, t.eggMusic],
  )

  return (
    <>
      {STICKERS.map((sticker) => {
        const z = 20 + zOrder.indexOf(sticker.id)
        const shift = positions[sticker.id] ?? { x: 0, y: 0 }
        const tooltip = TOOLTIPS[sticker.id]?.[language] || TOOLTIPS[sticker.id]?.es
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
            tooltip={tooltip}
          />
        )
      })}
    </>
  )
}
