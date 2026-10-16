"use client"

import { useEffect, useRef, useState } from "react"
import { EMAIL_URL } from "@/lib/constants"
import { CALENDAR_URL, HAS_CALENDAR } from "@/lib/redesign/config"
import { refreshScrollTrigger, useGsap } from "@/hooks/use-gsap"
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
  const nameRef = useRef<HTMLParagraphElement>(null)
  const entered = useRef(false)
  const docked = useRef(false)
  const firstName = t.brandName.split(" ")[0] || "Eze"

  useEffect(() => {
    void refreshScrollTrigger()
  }, [language])

  const rootRef = useGsap(
    (gsap, _root, { Flip, ScrollTrigger }) => {
      const stickers = gsap.utils.toArray<HTMLElement>(".sticker")
      const titleLines = gsap.utils.toArray<HTMLElement>("[data-hero-line]")
      const card = document.querySelector<HTMLElement>("[data-note-card]")
      let onDone: (() => void) | null = null

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
          rotate: (i: number) => Number(stickers[i]?.dataset.rotate || 0),
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
        onDone = () => entrance()
        window.addEventListener("eze:loader-done", onDone, { once: true })
      }

      // Real Flip: brand name ↔ [Eze] header slot
      const name = nameRef.current
      if (name && Flip) {
        const dock = () => {
          if (docked.current) return
          docked.current = true
          const state = Flip.getState(name)
          name.classList.add("is-docked")
          name.textContent = `[${firstName}]`
          Flip.from(state, {
            duration: 0.65,
            ease: "power2.inOut",
            absolute: true,
            scale: true,
          })
        }
        const undock = () => {
          if (!docked.current) return
          docked.current = false
          const state = Flip.getState(name)
          name.classList.remove("is-docked")
          name.textContent = t.brandName
          Flip.from(state, {
            duration: 0.55,
            ease: "power2.inOut",
            absolute: true,
            scale: true,
          })
        }

        ScrollTrigger.create({
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            if (self.progress > 0.52) dock()
            else if (self.progress < 0.4) undock()
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

      return () => {
        if (onDone) window.removeEventListener("eze:loader-done", onDone)
        docked.current = false
      }
    },
    [language, t.brandName, firstName],
    { flip: true },
  )

  return (
    <div ref={rootRef}>
      <section data-hero className="canvas-grid relative min-h-svh overflow-hidden bg-[#12131A]">
        <StickerField />
        <div className="pointer-events-none relative z-30 mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center px-5 pb-36 pt-16 text-center">
          <Clock />
          <p
            ref={nameRef}
            data-brand-name
            className="brand-name mt-4 font-display text-[clamp(2rem,5vw,3.4rem)] leading-none tracking-[-0.05em] text-[#F4F1EA] will-change-transform"
          >
            {t.brandName}
          </p>
          <h1
            data-hero-title
            className="mt-3 origin-top font-display text-[clamp(2.8rem,7.5vw,6rem)] leading-[0.88] tracking-[-0.05em] text-[#F4F1EA]"
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
          <p className="scroll-cue mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4F1EA]/55">
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
