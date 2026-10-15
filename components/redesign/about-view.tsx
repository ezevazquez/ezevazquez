"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"

const KIND_LABEL = {
  es: { work: "Trabajo", study: "Estudios", side: "Propios" },
  en: { work: "Work", study: "Studies", side: "Side" },
} as const

export function AboutView() {
  const { t, language } = useCopy()
  const [filter, setFilter] = useState("all")
  const [current, setCurrent] = useState<string>(t.chapters[0]?.title ?? "")
  const reduced = useReducedMotion()
  const labels = KIND_LABEL[language]

  const chapters = t.chapters.filter((chapter) => filter === "all" || chapter.kind === filter)

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"))
    const first = nodes[0]?.getAttribute("data-chapter")
    if (first) setCurrent(first)
    if (!nodes.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const title = visible?.target.getAttribute("data-chapter")
        if (title) setCurrent(title)
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.2, 0.6] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [filter, language])

  useEffect(() => {
    if (reduced) return
    let ctx: { revert: () => void } | null = null
    let dead = false
    ;(async () => {
      const gsap = (await import("gsap")).default
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      if (dead) return
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-title]").forEach((title) => {
          gsap.to(title, {
            filter: "blur(8px)",
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: title,
              start: "top 18%",
              end: "top -10%",
              scrub: true,
            },
          })
        })
      })
      ScrollTrigger.refresh()
    })()
    return () => {
      dead = true
      ctx?.revert()
    }
  }, [reduced, filter, language])

  return (
    <div className="min-h-svh bg-[#EFECE6] text-[#12131A]">
      <header className="px-6 pb-16 pt-24 sm:px-12 sm:pt-28">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#12131A]/50">{t.aboutKicker}</p>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(3.4rem,9vw,7.5rem)] leading-[0.88] tracking-[-0.05em]">
          {t.aboutTitle}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[#12131A]/70">{t.aboutSub}</p>
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={t.aboutKicker}>
          {t.filters.map((item) => {
            const count =
              item.id === "all"
                ? t.chapters.length
                : t.chapters.filter((chapter) => chapter.kind === item.id).length
            const selected = filter === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(item.id)}
                className={`press rounded-full border px-3 py-1.5 font-mono text-xs ${
                  selected
                    ? "border-[#1F4BFF] bg-[#1F4BFF] text-white"
                    : "border-[#12131A]/15 bg-transparent text-[#12131A]"
                }`}
              >
                {item.label} {count}
              </button>
            )
          })}
        </div>
      </header>

      <ol className="relative px-6 pb-36 sm:px-12">
        <div className="absolute bottom-28 left-[1.35rem] top-0 w-px bg-[#12131A]/15 sm:left-12" aria-hidden />
        {chapters.map((chapter) => (
          <li
            key={chapter.id}
            data-chapter={chapter.title}
            className="relative grid gap-4 border-t border-[#12131A]/10 py-12 md:grid-cols-[180px_1fr] md:gap-12"
          >
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#12131A]/55">
              <p>
                {chapter.year}
                {chapter.end ? ` — ${chapter.end}` : ""}
              </p>
              <p className="mt-2">{chapter.place}</p>
              <p className="mt-3 inline-flex rounded-full bg-[#12131A] px-2 py-1 text-[10px] text-[#F4F1EA]">
                {labels[chapter.kind]}
              </p>
            </div>
            <div>
              <h2
                data-title
                className="font-display text-[clamp(2.6rem,6vw,5.2rem)] leading-[0.9] tracking-[-0.05em]"
              >
                {chapter.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg text-[#12131A]/75">{chapter.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="pointer-events-none fixed right-8 top-1/2 z-[3] hidden -translate-y-1/2 lg:block">
        <p className="mb-4 max-w-[9rem] text-right font-mono text-[11px] uppercase tracking-[0.16em] text-[#1F4BFF]">
          {current}
        </p>
        <ol className="space-y-3 text-right font-mono text-[10px] uppercase tracking-[0.14em]">
          {chapters.map((chapter) => {
            const active = chapter.title === current
            return (
              <li key={chapter.id} className={active ? "text-[#12131A]" : "text-[#12131A]/35"}>
                <span className={`mr-2 inline-block h-px align-middle ${active ? "w-8 bg-[#1F4BFF]" : "w-4 bg-[#12131A]/25"}`} />
                {chapter.year}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
