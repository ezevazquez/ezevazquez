"use client"

import { useEffect, useRef, useState } from "react"
import { EMAIL_URL } from "@/lib/constants"
import { CALENDAR_URL, HAS_CALENDAR } from "@/lib/redesign/config"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { refreshScrollTrigger } from "@/hooks/use-gsap"
import { useCopy } from "@/lib/redesign/use-copy"
import { NoteCard, StickerField } from "./stickers"
import { TransitionLink } from "./transition-link"

function Clock() {
  const { t } = useCopy()
  const [time, setTime] = useState("")
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "America/Argentina/Buenos_Aires",
      }).format(new Date())
    setTime(format())
    const id = window.setInterval(() => setTime(format()), 15000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <p
      className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#F4F1EA]/60"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={t.clockHover}
    >
      {hover ? t.clockHover : t.clock}
      {!hover && (
        <>
          <span className="mx-2 text-[#1F4BFF]">·</span>
          {time}
        </>
      )}
    </p>
  )
}

export function HomeView() {
  const { t, language } = useCopy()
  const rootRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const slotRef = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const entered = useRef(false)

  useEffect(() => {
    void refreshScrollTrigger()
  }, [language])

  useEffect(() => {
    if (reduced || !rootRef.current) return
    let ctx: { revert: () => void } | null = null
    let dead = false

    const run = async () => {
      const gsap = (await import("gsap")).default
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      const { Flip } = await import("gsap/Flip")
      if (dead || !rootRef.current) return
      gsap.registerPlugin(ScrollTrigger, Flip)

      ctx = gsap.context(() => {
        const stickers = gsap.utils.toArray<HTMLElement>(".sticker")
        const titleLines = gsap.utils.toArray<HTMLElement>("[data-hero-line]")
        const card = document.querySelector<HTMLElement>("[data-note-card]")

        const entrance = () => {
          if (entered.current) return
          entered.current = true
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
          gsap.set(stickers, { y: -80, opacity: 0, rotate: 0 })
          gsap.set(titleLines, { yPercent: 110 })
          if (card) gsap.set(card, { scale: 0.92, opacity: 0 })

          tl.to(stickers, {
            y: 0,
            opacity: 1,
            rotate: (i) => Number(stickers[i]?.dataset.rotate || 0),
            duration: 0.9,
            stagger: 0.06,
            ease: "back.out(1.6)",
          })
          if (card) {
            tl.to(card, { scale: 1, opacity: 1, duration: 0.55 }, "-=0.45")
          }
          tl.to(titleLines, { yPercent: 0, duration: 0.85, stagger: 0.08 }, "-=0.35")
        }

        if (document.documentElement.classList.contains("loader-done")) {
          entrance()
        } else {
          const onDone = () => entrance()
          window.addEventListener("eze:loader-done", onDone, { once: true })
        }

        // Name shrinks into header slot (Alejandro HA)
        if (nameRef.current && slotRef.current) {
          const name = nameRef.current
          ScrollTrigger.create({
            trigger: "[data-hero]",
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              const p = self.progress
              gsap.set(name, {
                scale: 1 - p * 0.72,
                y: -p * 40,
                opacity: 1 - p * 0.15,
              })
              gsap.set(slotRef.current, { opacity: Math.max(0, (p - 0.55) / 0.45) })
            },
          })
        }

        gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => {
          gsap.from(line, {
            yPercent: 110,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: line, start: "top 88%", once: true },
          })
        })

        if (window.matchMedia("(min-width: 768px)").matches) {
          gsap.utils.toArray<HTMLElement>("[data-sharpen]").forEach((node) => {
            gsap.from(node, {
              filter: "blur(8px)",
              opacity: 0.35,
              duration: 0.75,
              ease: "power2.out",
              scrollTrigger: { trigger: node, start: "top 86%", once: true },
            })
          })
        } else {
          gsap.utils.toArray<HTMLElement>("[data-sharpen]").forEach((node) => {
            gsap.from(node, {
              opacity: 0.35,
              y: 12,
              duration: 0.55,
              ease: "power2.out",
              scrollTrigger: { trigger: node, start: "top 88%", once: true },
            })
          })
        }

        gsap.from("[data-wipe]", {
          clipPath: "polygon(0 0, 100% 0, 100% 0, 0 18%)",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-wipe]",
            start: "top 85%",
            end: "top 25%",
            scrub: true,
          },
        })

        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]")
        panels.forEach((panel) => {
          const blur = panel.querySelector("[data-panel-blur]")
          if (!blur) return
          const mobile = !window.matchMedia("(min-width: 768px)").matches
          gsap.to(blur, {
            filter: mobile ? "none" : "blur(10px)",
            scale: 0.94,
            opacity: 0.45,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "center top",
              end: "bottom top",
              scrub: true,
            },
          })
        })

        // Draw line between how-I-work steps
        const howLine = document.querySelector<SVGPathElement>("[data-how-line]")
        if (howLine) {
          const length = howLine.getTotalLength()
          gsap.set(howLine, { strokeDasharray: length, strokeDashoffset: length })
          gsap.to(howLine, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-how]",
              start: "top 70%",
              end: "bottom 55%",
              scrub: true,
            },
          })
        }
      }, rootRef)

      ScrollTrigger.refresh()
    }

    void run()
    return () => {
      dead = true
      ctx?.revert()
    }
  }, [reduced, language])

  return (
    <div ref={rootRef}>
      <p
        ref={slotRef}
        data-name-slot
        className="pointer-events-none fixed left-5 top-5 z-[40] font-display text-2xl tracking-[-0.05em] text-[#F4F1EA] opacity-0 mix-blend-difference"
      >
        [{t.brandName.split(" ")[0]}]
      </p>

      <section data-hero className="canvas-grid relative min-h-svh overflow-hidden bg-[#12131A]">
        <StickerField />
        <div className="pointer-events-none relative z-30 mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center px-5 pb-28 pt-20 text-center">
          <Clock />
          <h1
            ref={nameRef}
            data-hero-title
            className="mt-6 origin-top font-display text-[clamp(3.2rem,9vw,7.4rem)] leading-[0.88] tracking-[-0.05em] text-[#F4F1EA] will-change-transform"
          >
            <span className="line-mask">
              <span data-hero-line className="block">
                {t.heroTitle}
              </span>
            </span>
            <span className="line-mask mt-2 block text-[clamp(1.7rem,4.4vw,3.4rem)] leading-[0.95]">
              <span data-hero-line className="block">
                {t.heroLine}
              </span>
            </span>
          </h1>
          <p data-sharpen className="mt-6 max-w-[36rem] text-base leading-relaxed text-[#F4F1EA]/75 sm:text-lg">
            {t.heroSub}
          </p>
          <div className="pointer-events-auto" data-note-card>
            <NoteCard />
          </div>
          <p className="scroll-cue mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4F1EA]/45">
            {t.scroll}
          </p>
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/10 bg-[#12131A] py-4">
        <div className="marquee-track flex w-max gap-10">
          {Array.from({ length: 2 }, (_, loop) => (
            <p key={loop} className="flex gap-10 font-display text-4xl tracking-[-0.04em] text-[#F4F1EA]/80">
              {t.what.map((item) => (
                <span key={`${loop}-${item.n}`} className="flex items-center gap-10">
                  {item.word}
                  <span className="text-[#1F4BFF]">/</span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      <section
        data-wipe
        className="flex min-h-svh items-center bg-[#1F4BFF] px-6 py-28 text-[#F4F1EA] sm:px-12"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em]">{t.whatKicker}</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] tracking-[-0.05em]">
            <span className="line-mask">
              <span data-line className="block">
                {t.whatTitle}
              </span>
            </span>
          </h2>
        </div>
      </section>

      {t.what.map((item, index) => (
        <article
          key={item.n}
          data-panel={index < t.what.length - 1 ? "true" : undefined}
          className={`sticky top-0 flex min-h-svh items-center px-6 py-28 sm:px-12 ${
            index === 2 ? "bg-[#1F4BFF] text-[#F4F1EA]" : index === 1 ? "bg-[#181a22]" : "bg-[#12131A]"
          }`}
        >
          <div data-panel-blur={index < t.what.length - 1 ? "true" : undefined} className="w-full">
            <p className="font-mono text-sm text-[#1F4BFF]">[{item.n}]</p>
            <h3 className="mt-4 max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] tracking-[-0.05em]">
              <span className="line-mask">
                <span data-line className="block">
                  {item.title}
                </span>
              </span>
            </h3>
            <p data-sharpen className="mt-6 max-w-xl text-lg text-[#F4F1EA]/75">
              {item.body}
            </p>
          </div>
        </article>
      ))}

      <section data-how className="relative bg-[#EFECE6] px-6 py-24 text-[#12131A] sm:px-12 sm:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#12131A]/55">{t.howKicker}</p>
        <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.9] tracking-[-0.05em]">
          <span className="line-mask">
            <span data-line className="block">
              {t.howTitle}
            </span>
          </span>
        </h2>
        <svg
          className="pointer-events-none absolute left-0 right-0 top-[58%] hidden h-24 w-full md:block"
          viewBox="0 0 1000 80"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            data-how-line
            d="M80 40 C 280 10, 420 70, 500 40 S 780 10, 920 40"
            fill="none"
            stroke="#1F4BFF"
            strokeWidth="2"
          />
        </svg>
        <ol className="relative mt-16 grid gap-12 md:grid-cols-3">
          {t.how.map((step) => (
            <li key={step.n}>
              <p className="font-mono text-sm text-[#1F4BFF]">[{step.n}]</p>
              <h3 className="mt-3 font-display text-3xl leading-none tracking-[-0.04em]">{step.title}</h3>
              <p className="mt-3 max-w-xs text-[#12131A]/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-[#1F4BFF] px-6 py-28 text-[#F4F1EA] sm:px-12">
        <p
          aria-hidden
          className="pointer-events-none absolute bottom-8 right-6 font-display text-[28vw] leading-none tracking-[-0.08em] text-white/10"
        >
          [ ]
        </p>
        <h2 className="relative max-w-4xl font-display text-[clamp(3.2rem,9vw,7rem)] leading-[0.88] tracking-[-0.05em]">
          {t.ctaTitle}
        </h2>
        <div className="relative mt-8 flex flex-wrap items-center gap-4">
          {HAS_CALENDAR ? (
            <a
              href={CALENDAR_URL}
              className="press magnetic rounded-full bg-[#F4F1EA] px-6 py-3 font-mono text-sm text-[#12131A]"
              target="_blank"
              rel="noreferrer"
            >
              {t.ctaButton}
            </a>
          ) : (
            <TransitionLink
              href="/contact"
              className="press magnetic rounded-full bg-[#F4F1EA] px-6 py-3 font-mono text-sm text-[#12131A]"
            >
              {t.ctaButton}
            </TransitionLink>
          )}
          <a
            href={EMAIL_URL}
            className="press font-mono text-sm text-[#F4F1EA] underline-offset-4 hover:underline"
          >
            {t.ctaNote}
          </a>
        </div>
        <p className="relative mt-16 font-display text-[12vw] leading-none tracking-[-0.06em] text-white/15">
          {t.brandName}
        </p>
      </section>
    </div>
  )
}
