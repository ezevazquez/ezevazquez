"use client"

import { useEffect } from "react"
import { refreshScrollTrigger, useGsap } from "@/hooks/use-gsap"
import { useCopy } from "@/lib/redesign/use-copy"
import { TransitionLink } from "./transition-link"

/** Placeholder case slots — no invented metrics/cases. */
const PLACEHOLDERS = [
  { id: "p1", href: null as string | null },
  { id: "p2", href: null as string | null },
  { id: "p3", href: null as string | null },
]

function Frame({ index, compact = false }: { index: number; compact?: boolean }) {
  const kind = index % 3
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-canvas-raised shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] ${
        compact ? "h-36 w-48" : "h-64 w-48 sm:h-80 sm:w-60"
      }`}
    >
      {kind === 0 && (
        <div className="flex h-full flex-col justify-between p-4">
          <div className="h-2 w-16 rounded-full bg-signal" />
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-paper/20" />
            <div className="h-2 w-4/5 rounded-full bg-paper/15" />
            <div className="h-2 w-2/3 rounded-full bg-signal/80" />
          </div>
        </div>
      )}
      {kind === 1 && (
        <div className="grid h-full grid-cols-3 gap-2 p-4">
          {Array.from({ length: 9 }, (_, cell) => (
            <div key={cell} className={`rounded-md ${cell % 4 === 0 ? "bg-signal" : "bg-paper/10"}`} />
          ))}
        </div>
      )}
      {kind === 2 && (
        <div className="flex h-full items-end p-4">
          <div className="flex w-full items-end gap-2">
            {[40, 70, 55, 90, 60].map((height) => (
              <div key={height} className="flex-1 rounded-t-md bg-signal" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function WorkView() {
  const { t, language } = useCopy()

  useEffect(() => {
    void refreshScrollTrigger()
  }, [language])

  const rootRef = useGsap((gsap) => {
    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((node) => {
      const distance = Number(node.dataset.parallax || 80)
      gsap.fromTo(
        node,
        { y: distance },
        {
          y: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: node.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )
    })

    gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((node) => {
      gsap.fromTo(
        node,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          ease: "power3.out",
          duration: 1,
          scrollTrigger: { trigger: node, start: "top 80%", once: true },
        },
      )
    })

    gsap.utils.toArray<HTMLElement>("[data-stroke-word]").forEach((node) => {
      gsap.fromTo(
        node,
        { webkitTextStrokeColor: "rgba(244,241,234,0.35)", color: "transparent" },
        {
          webkitTextStrokeColor: "transparent",
          color: "rgba(244,241,234,0.12)",
          ease: "none",
          scrollTrigger: {
            trigger: node.closest("section"),
            start: "top 60%",
            end: "bottom 40%",
            scrub: true,
          },
        },
      )
    })

    const quoteWords = gsap.utils.toArray<HTMLElement>("[data-quote-word]")
    quoteWords.forEach((word, i) => {
      gsap.fromTo(
        word,
        { opacity: 0.22 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-quote]",
            start: `top ${70 - i * 2}%`,
            end: `top ${55 - i * 2}%`,
            scrub: true,
          },
        },
      )
    })

    const marquee = document.querySelector<HTMLElement>("[data-speed-marquee]")
    if (marquee) {
      gsap.to(marquee, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: marquee.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
        },
      })
    }
  }, [language])

  const items = t.what.map((item, index) => ({
    ...item,
    placeholder: PLACEHOLDERS[index],
  }))

  return (
    <div ref={rootRef} className="bg-canvas text-paper">
      <header className="px-6 pb-10 pt-24 sm:px-12 sm:pt-28">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper/50">{t.workKicker}</p>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(3.4rem,9vw,7.5rem)] leading-[0.88] tracking-[-0.05em]">
          {t.workTitle}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-paper/70">{t.workSub}</p>
      </header>

      {items.map((item, index) => {
        const hasHref = Boolean(item.placeholder?.href)
        return (
          <section key={item.n} className="relative min-h-[140svh]">
            <p
              data-stroke-word
              aria-hidden
              className="pointer-events-none sticky top-[18vh] block px-4 font-display text-[28vw] leading-none tracking-[-0.07em] text-transparent"
              style={{ WebkitTextStroke: "1px rgba(244,241,234,0.35)" }}
            >
              {item.word}
            </p>
            <div className="absolute inset-0">
              <div
                className="group/shot absolute left-[8vw] top-[22vh]"
                data-parallax="140"
                {...(hasHref ? { "data-cursor": "view" as const } : {})}
              >
                <div data-clip>
                  <Frame index={index} />
                </div>
                {hasHref ? (
                  <span className="work-cursor-label pointer-events-none absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.18em] text-paper opacity-0 transition-opacity duration-200 ease-out group-hover/shot:opacity-100">
                    {t.view}
                  </span>
                ) : null}
                <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.16em] text-paper/55">
                  [{t.workPlaceholder}]
                </span>
              </div>
              <div className="absolute right-[10vw] top-[48vh] hidden sm:block" data-parallax="70" data-clip>
                <Frame index={index + 1} compact />
              </div>
              <div className="group absolute bottom-[18vh] left-6 z-[1] max-w-xl sm:left-12">
                <p className="font-mono text-sm text-signal">[{item.n}]</p>
                <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.92] tracking-[-0.045em]">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-md text-paper/75">{item.body}</p>
                {hasHref && item.placeholder?.href ? (
                  <a
                    href={item.placeholder.href}
                    className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.18em] text-paper"
                  >
                    {t.view}
                  </a>
                ) : (
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-paper/55">
                    {t.workPlaceholder}
                  </p>
                )}
              </div>
            </div>
          </section>
        )
      })}

      <section data-quote className="px-6 py-28 sm:px-12">
        <p className="max-w-4xl font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1.15] tracking-[-0.04em]">
          {t.workQuote.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} data-quote-word className="inline-block opacity-20">
              {word}&nbsp;
            </span>
          ))}
        </p>
      </section>

      <div className="overflow-hidden border-y border-white/10 py-8">
        <div data-speed-marquee className="flex w-max gap-16 font-display text-[12vw] leading-none tracking-[-0.06em] text-paper/80">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>{t.workMarquee}</span>
          ))}
        </div>
      </div>

      <div className="px-6 pb-36 pt-16 sm:px-12">
        <TransitionLink
          href="/contact"
          className="press magnetic inline-flex rounded-full bg-signal px-6 py-3 font-mono text-sm text-white"
        >
          {t.ctaButton}
        </TransitionLink>
      </div>
    </div>
  )
}
