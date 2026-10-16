"use client"

import { useEffect, useRef } from "react"
import { EMAIL_URL } from "@/lib/constants"
import { CALENDAR_URL, HAS_CALENDAR } from "@/lib/redesign/config"
import { refreshScrollTrigger, useGsap } from "@/hooks/use-gsap"
import { useCopy } from "@/lib/redesign/use-copy"
import { StickerField } from "./stickers"
import { SlideDeck } from "./slide-deck"
import { DrawWall } from "./draw-wall"
import { WallNotes } from "./wall-notes"
import { TransitionLink } from "./transition-link"

export function HomeView() {
  const { t, language } = useCopy()
  const entered = useRef(false)

  useEffect(() => {
    void refreshScrollTrigger()
  }, [language])

  const rootRef = useGsap(
    (gsap) => {
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
      }
    },
    [language],
  )

  return (
    <div ref={rootRef}>
      <section data-hero className="canvas-grid relative min-h-svh overflow-hidden bg-canvas">
        <DrawWall />
        <StickerField />
        <div className="pointer-events-none relative z-30 mx-auto flex min-h-svh max-w-3xl items-center justify-center px-5 pb-28 pt-16 text-center">
          <h1 className="sr-only">{`${t.heroTitle} ${t.heroLine}`}</h1>
          <div className="pointer-events-auto w-full" data-note-card>
            <SlideDeck />
            <div className="mt-4">
              <WallNotes />
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/10 bg-canvas py-4">
        <div className="marquee-track flex w-max gap-10">
          {Array.from({ length: 2 }, (_, loop) => (
            <p key={loop} className="flex gap-10 font-display text-4xl tracking-[-0.04em] text-paper/80">
              {t.what.map((item) => (
                <span key={`${loop}-${item.n}`} className="flex items-center gap-10">
                  {item.word}
                  <span className="text-signal">/</span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      <section
        data-wipe
        className="flex min-h-svh items-center bg-signal px-6 py-28 text-paper sm:px-12"
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
            index === 2 ? "bg-signal text-paper" : index === 1 ? "bg-canvas-raised" : "bg-canvas"
          }`}
        >
          <div data-panel-blur={index < t.what.length - 1 ? "true" : undefined} className="w-full">
            <p className="font-mono text-sm text-signal">[{item.n}]</p>
            <h3 className="mt-4 max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] tracking-[-0.05em]">
              <span className="line-mask">
                <span data-line className="block">
                  {item.title}
                </span>
              </span>
            </h3>
            <p data-sharpen className="mt-6 max-w-xl text-lg text-paper/75">
              {item.body}
            </p>
          </div>
        </article>
      ))}

      <section data-how className="relative bg-sheet px-6 py-24 text-canvas sm:px-12 sm:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-canvas/55">{t.howKicker}</p>
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
            stroke="var(--color-action)"
            strokeWidth="2"
          />
        </svg>
        <ol className="relative mt-16 grid gap-12 md:grid-cols-3">
          {t.how.map((step) => (
            <li key={step.n}>
              <p className="font-mono text-sm text-signal">[{step.n}]</p>
              <h3 className="mt-3 font-display text-3xl leading-none tracking-[-0.04em]">{step.title}</h3>
              <p className="mt-3 max-w-xs text-canvas/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-signal px-6 py-28 text-paper sm:px-12">
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
              className="press magnetic rounded-full bg-paper px-6 py-3 font-mono text-sm text-canvas"
              target="_blank"
              rel="noreferrer"
            >
              {t.ctaButton}
            </a>
          ) : (
            <TransitionLink
              href="/contact"
              className="press magnetic rounded-full bg-paper px-6 py-3 font-mono text-sm text-canvas"
            >
              {t.ctaButton}
            </TransitionLink>
          )}
          <a
            href={EMAIL_URL}
            className="press font-mono text-sm text-paper underline-offset-4 hover:underline"
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
