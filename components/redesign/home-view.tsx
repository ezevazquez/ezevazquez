"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { EMAIL_URL } from "@/lib/constants"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { NoteCard, StickerField } from "./stickers"

function Clock() {
  const { t } = useCopy()
  const [time, setTime] = useState("")

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
    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#F4F1EA]/60">
      {t.clock}
      <span className="mx-2 text-[#1F4BFF]">·</span>
      {time}
    </p>
  )
}

export function HomeView() {
  const { t } = useCopy()
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !rootRef.current) return
    let ctx: { revert: () => void } | null = null
    let dead = false

    ;(async () => {
      const gsap = (await import("gsap")).default
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      if (dead || !rootRef.current) return
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => {
          gsap.from(line, {
            yPercent: 110,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: line, start: "top 88%", once: true },
          })
        })
        gsap.utils.toArray<HTMLElement>("[data-sharpen]").forEach((node) => {
          gsap.from(node, {
            filter: "blur(12px)",
            opacity: 0.35,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: { trigger: node, start: "top 86%", once: true },
          })
        })
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
        const pin = document.querySelector("[data-name-pin]")
        if (pin) {
          gsap.fromTo(
            pin,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-hero]",
                start: "bottom 90%",
                end: "bottom 55%",
                scrub: true,
              },
            },
          )
        }
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]")
        panels.forEach((panel) => {
          const blur = panel.querySelector("[data-panel-blur]")
          if (!blur) return
          gsap.to(blur, {
            filter: "blur(14px)",
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
      }, rootRef)
      ScrollTrigger.refresh()
    })()

    return () => {
      dead = true
      ctx?.revert()
    }
  }, [reduced])

  return (
    <div ref={rootRef}>
      <p
        data-name-pin
        className="pointer-events-none fixed left-5 top-5 z-[40] font-display text-2xl tracking-[-0.05em] text-[#F4F1EA] opacity-0 mix-blend-difference"
      >
        Eze
      </p>
      <section data-hero className="canvas-grid relative min-h-svh overflow-hidden bg-[#12131A]">
        <StickerField />
        <div className="pointer-events-none relative z-30 mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center px-5 pb-28 pt-20 text-center">
          <Clock />
          <h1 data-hero-title className="mt-6 font-display text-[clamp(3.2rem,9vw,7.4rem)] leading-[0.88] tracking-[-0.05em] text-[#F4F1EA]">
            <span className="line-mask">
              <span className="block">{t.heroTitle}</span>
            </span>
            <span className="line-mask mt-2 block text-[clamp(1.7rem,4.4vw,3.4rem)] leading-[0.95]">
              <span className="block">{t.heroLine}</span>
            </span>
          </h1>
          <p data-sharpen className="mt-6 max-w-[36rem] text-base leading-relaxed text-[#F4F1EA]/75 sm:text-lg">
            {t.heroSub}
          </p>
          <div className="pointer-events-auto">
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
              <span data-line className="block">{t.whatTitle}</span>
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
                <span data-line className="block">{item.title}</span>
              </span>
            </h3>
            <p data-sharpen className="mt-6 max-w-xl text-lg text-[#F4F1EA]/75">{item.body}</p>
          </div>
        </article>
      ))}

      <section className="bg-[#EFECE6] px-6 py-24 text-[#12131A] sm:px-12 sm:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#12131A]/55">{t.howKicker}</p>
        <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.9] tracking-[-0.05em]">
          <span className="line-mask">
            <span data-line className="block">{t.howTitle}</span>
          </span>
        </h2>
        <ol className="mt-16 grid gap-12 md:grid-cols-3">
          {t.how.map((step) => (
            <li key={step.n}>
              <p className="font-mono text-sm text-[#1F4BFF]">[{step.n}]</p>
              <h3 className="mt-3 font-display text-3xl leading-none tracking-[-0.04em]">{step.title}</h3>
              <p className="mt-3 max-w-xs text-[#12131A]/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex min-h-svh flex-col justify-center bg-[#1F4BFF] px-6 py-28 text-[#F4F1EA] sm:px-12">
        <h2 className="max-w-4xl font-display text-[clamp(3.2rem,9vw,7rem)] leading-[0.88] tracking-[-0.05em]">
          {t.ctaTitle}
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            className="press rounded-full bg-[#F4F1EA] px-6 py-3 font-mono text-sm text-[#12131A]"
          >
            {t.ctaButton}
          </Link>
          <a href={EMAIL_URL} className="press font-mono text-sm text-[#F4F1EA] underline-offset-4 hover:underline">
            {t.ctaNote}
          </a>
        </div>
      </section>
    </div>
  )
}
