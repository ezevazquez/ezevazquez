"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"

function Frame({ index, compact = false }: { index: number; compact?: boolean }) {
  const kind = index % 3
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#181a22] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] ${
        compact ? "h-36 w-48" : "h-64 w-48 sm:h-80 sm:w-60"
      }`}
    >
      {kind === 0 && (
        <div className="flex h-full flex-col justify-between p-4">
          <div className="h-2 w-16 rounded-full bg-[#1F4BFF]" />
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-[#F4F1EA]/20" />
            <div className="h-2 w-4/5 rounded-full bg-[#F4F1EA]/15" />
            <div className="h-2 w-2/3 rounded-full bg-[#1F4BFF]/80" />
          </div>
        </div>
      )}
      {kind === 1 && (
        <div className="grid h-full grid-cols-3 gap-2 p-4">
          {Array.from({ length: 9 }, (_, cell) => (
            <div key={cell} className={`rounded-md ${cell % 4 === 0 ? "bg-[#1F4BFF]" : "bg-[#F4F1EA]/10"}`} />
          ))}
        </div>
      )}
      {kind === 2 && (
        <div className="flex h-full items-end p-4">
          <div className="flex w-full items-end gap-2">
            {[40, 70, 55, 90, 60].map((height) => (
              <div key={height} className="flex-1 rounded-t-md bg-[#1F4BFF]" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function WorkView() {
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
      }, rootRef)
      ScrollTrigger.refresh()
    })()

    return () => {
      dead = true
      ctx?.revert()
    }
  }, [reduced])

  return (
    <div ref={rootRef} className="bg-[#12131A] text-[#F4F1EA]">
      <header className="px-6 pb-10 pt-24 sm:px-12 sm:pt-28">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#F4F1EA]/50">{t.workKicker}</p>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(3.4rem,9vw,7.5rem)] leading-[0.88] tracking-[-0.05em]">
          {t.workTitle}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[#F4F1EA]/70">{t.workSub}</p>
      </header>

      {t.what.map((item, index) => (
        <section key={item.n} className="relative min-h-[140svh] overflow-hidden">
          <p
            aria-hidden
            className="pointer-events-none sticky top-[18vh] block px-4 font-display text-[28vw] leading-none tracking-[-0.07em] text-[#F4F1EA]/[0.08]"
          >
            {item.word}
          </p>
          <div className="absolute inset-0">
            <div className="group/shot absolute left-[8vw] top-[22vh]" data-parallax="140">
              <Frame index={index} />
              <span className="pointer-events-none absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4F1EA] opacity-0 transition-opacity duration-200 ease-out group-hover/shot:opacity-100">
                {t.view}
              </span>
            </div>
            <div className="absolute right-[10vw] top-[48vh] hidden sm:block" data-parallax="70">
              <Frame index={index + 1} compact />
            </div>
            <div className="group absolute bottom-[18vh] left-6 z-[1] max-w-xl sm:left-12">
              <p className="font-mono text-sm text-[#1F4BFF]">[{item.n}]</p>
              <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.92] tracking-[-0.045em]">
                {item.title}
              </h2>
              <p className="mt-3 max-w-md text-[#F4F1EA]/75">{item.body}</p>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-[#F4F1EA] opacity-70 transition-opacity duration-200 ease-out group-hover:opacity-100">
                {t.view}
              </p>
            </div>
          </div>
        </section>
      ))}

      <div className="px-6 pb-36 sm:px-12">
        <Link href="/contact" className="press inline-flex rounded-full bg-[#1F4BFF] px-6 py-3 font-mono text-sm text-white">
          {t.ctaButton}
        </Link>
      </div>
    </div>
  )
}
