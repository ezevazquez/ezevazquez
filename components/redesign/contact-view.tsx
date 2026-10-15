"use client"

import { useEffect, useRef, useState } from "react"
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL, SITE_EMAIL } from "@/lib/constants"
import { CALENDAR_URL, HAS_CALENDAR } from "@/lib/redesign/config"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"

const LINKS = [
  { key: "mail" as const, href: EMAIL_URL },
  { key: "linkedin" as const, href: LINKEDIN_URL },
  { key: "github" as const, href: GITHUB_URL },
]

function burstConfetti(root: HTMLElement) {
  const colors = ["#1F4BFF", "#F4F1EA", "#E9C46A", "#2A9D8F"]
  for (let i = 0; i < 28; i++) {
    const bit = document.createElement("span")
    bit.className = "confetti-bit"
    bit.style.setProperty("--x", `${(Math.random() - 0.5) * 220}px`)
    bit.style.setProperty("--y", `${-40 - Math.random() * 120}px`)
    bit.style.setProperty("--r", `${Math.random() * 360}deg`)
    bit.style.background = colors[i % colors.length]
    bit.style.left = "50%"
    bit.style.top = "40%"
    root.appendChild(bit)
    window.setTimeout(() => bit.remove(), 900)
  }
}

export function ContactView() {
  const { t } = useCopy()
  const reduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const [flipped, setFlipped] = useState(false)
  const [copied, setCopied] = useState(false)
  const tilt = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reduced || !cardRef.current) return
    let dead = false
    ;(async () => {
      const gsap = (await import("gsap")).default
      if (dead || !cardRef.current) return
      gsap.from(cardRef.current, {
        y: -120,
        rotate: -14,
        scale: 0.9,
        opacity: 0,
        duration: 1.05,
        ease: "elastic.out(1, 0.55)",
        delay: 0.12,
      })
      gsap.from("[data-hand]", {
        y: -160,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      })
    })()
    return () => {
      dead = true
    }
  }, [reduced])

  const applyTilt = () => {
    if (!cardRef.current || flipped) return
    const { x, y } = tilt.current
    cardRef.current.style.transform = `rotateX(${-y * 12}deg) rotateY(${x * 14}deg) rotate(-3deg)`
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !cardRef.current || flipped) return
    const rect = cardRef.current.getBoundingClientRect()
    tilt.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    }
    applyTilt()
    const shine = cardRef.current.querySelector<HTMLElement>("[data-shine]")
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${tilt.current.x * 100 + 50}% ${tilt.current.y * 100 + 50}%, rgba(255,255,255,0.45), transparent 55%)`
    }
  }

  const onPointerLeave = () => {
    tilt.current = { x: 0, y: 0 }
    if (!cardRef.current || flipped) return
    cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) rotate(-3deg)"
  }

  const copyMail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_EMAIL)
    } catch {
      /* ignore */
    }
    setCopied(true)
    if (!reduced && sceneRef.current) burstConfetti(sceneRef.current)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      ref={sceneRef}
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-5 pb-32 pt-24"
      style={{
        backgroundColor: "#12131A",
        backgroundImage: "radial-gradient(circle, rgba(244,241,234,0.16) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="relative flex flex-col items-center" style={{ perspective: 1200 }}>
        <svg
          data-hand
          viewBox="0 0 120 160"
          className="absolute -top-16 z-[2] h-28 w-20 text-[#F4F1EA]"
          aria-hidden
        >
          <path
            d="M58 8 C 70 8, 78 20, 76 40 L 76 70 C 90 68, 98 78, 96 90 C 108 92, 112 104, 106 114 C 116 120, 114 136, 100 140 L 48 148 C 28 140, 24 120, 30 104 L 34 70 L 34 40 C 34 20, 46 8, 58 8 Z"
            fill="currentColor"
            opacity="0.92"
          />
        </svg>

        <div
          ref={cardRef}
          className="relative h-[22rem] w-[min(100%,26rem)]"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped
              ? "rotateY(180deg) rotate(-3deg)"
              : "rotateY(0deg) rotate(-3deg)",
            transition: reduced ? "none" : "transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <article
            className="absolute inset-0 rounded-[1.6rem] bg-[#F4F1EA] px-7 py-8 text-[#12131A] shadow-[0_30px_80px_-28px_rgba(0,0,0,0.75)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div
              data-shine
              className="pointer-events-none absolute inset-0 rounded-[1.6rem] opacity-60 mix-blend-soft-light"
              aria-hidden
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#12131A]/50">{t.contactKicker}</p>
            <h1 className="mt-5 font-display text-5xl leading-[0.9] tracking-[-0.05em] sm:text-6xl">
              {t.contactTitle}
            </h1>
            <p className="mt-4 max-w-[16rem] text-[#12131A]/70">{t.contactSub}</p>
            {HAS_CALENDAR ? (
              <a
                href={CALENDAR_URL}
                className="press magnetic mt-8 inline-flex rounded-full bg-[#1F4BFF] px-5 py-3 font-mono text-sm text-white"
                target="_blank"
                rel="noreferrer"
              >
                {t.ctaButton}
              </a>
            ) : (
              <span className="mt-8 inline-flex rounded-full border border-[#12131A]/20 px-5 py-3 font-mono text-sm text-[#12131A]/60">
                {t.ctaCalendarSoon}
              </span>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="press rounded-full border border-[#12131A]/15 px-3 py-2 font-mono text-xs"
                onClick={() => setFlipped(true)}
              >
                {t.contactFlip}
              </button>
              <button
                type="button"
                className="press rounded-full bg-[#12131A] px-3 py-2 font-mono text-xs text-[#F4F1EA]"
                onClick={() => void copyMail()}
              >
                {copied ? t.contactCopied : t.contactCopy}
              </button>
            </div>
            <ul className="mt-8 flex gap-4 font-mono text-sm">
              {LINKS.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="press text-[#12131A] underline-offset-4 hover:underline"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    /{t[link.key].toLowerCase()}/
                  </a>
                </li>
              ))}
            </ul>
          </article>

          <article
            className="absolute inset-0 flex flex-col justify-between rounded-[1.6rem] bg-[#1F4BFF] px-7 py-8 text-[#F4F1EA] shadow-[0_30px_80px_-28px_rgba(0,0,0,0.75)]"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">mail</p>
              <p className="mt-6 font-display text-3xl tracking-[-0.04em]">{SITE_EMAIL}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="press rounded-full bg-[#F4F1EA] px-4 py-2 font-mono text-xs text-[#12131A]"
                onClick={() => void copyMail()}
              >
                {copied ? t.contactCopied : t.contactCopy}
              </button>
              <button
                type="button"
                className="press rounded-full border border-white/30 px-4 py-2 font-mono text-xs"
                onClick={() => setFlipped(false)}
              >
                ←
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
