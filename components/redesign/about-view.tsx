"use client"

import { useEffect, useState } from "react"
import { ABOUT_PROGRESS_KEY } from "@/lib/redesign/config"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { loadGsap, refreshScrollTrigger, useGsap } from "@/hooks/use-gsap"
import { useCopy } from "@/lib/redesign/use-copy"

const KIND_LABEL = {
  es: { work: "Trabajo", study: "Estudios", side: "Propios" },
  en: { work: "Work", study: "Studies", side: "Side" },
} as const

const KIND_COLOR = {
  work: "#1F4BFF",
  study: "#2A9D8F",
  side: "#E9C46A",
} as const

const YEARS = new Date().getFullYear() - 2018

export function AboutView() {
  const { t, language } = useCopy()
  const [filter, setFilter] = useState("all")
  const [current, setCurrent] = useState<string>(t.chapters[0]?.title ?? "")
  const [years, setYears] = useState(0)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const reduced = useReducedMotion()
  const labels = KIND_LABEL[language]

  const chapters = t.chapters.filter((chapter) => filter === "all" || chapter.kind === filter)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ABOUT_PROGRESS_KEY)
      if (saved) setResumeId(saved)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    void refreshScrollTrigger()
  }, [language, filter])

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
        const id = visible?.target.getAttribute("data-chapter-id")
        if (title) setCurrent(title)
        if (id) {
          try {
            localStorage.setItem(ABOUT_PROGRESS_KEY, id)
          } catch {
            /* ignore */
          }
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.2, 0.6] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [filter, language])

  useEffect(() => {
    if (reduced) {
      setYears(YEARS)
      return
    }
    let frame = 0
    const started = performance.now()
    const duration = 900
    const step = (now: number) => {
      const p = Math.min(1, (now - started) / duration)
      setYears(Math.round(p * YEARS))
      if (p < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [reduced, language])

  const listRef = useGsap(
    (gsap) => {
      const thread = document.querySelector<SVGPathElement>("[data-thread-path]")
      if (thread) {
        const len = thread.getTotalLength()
        gsap.set(thread, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(thread, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-about-root]",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        })
      }

      gsap.utils.toArray<HTMLElement>("[data-title]").forEach((title) => {
        gsap.fromTo(
          title,
          { opacity: 0.35, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: title, start: "top 82%", once: true },
          },
        )
        gsap.to(title, {
          filter: window.matchMedia("(min-width: 768px)").matches ? "blur(8px)" : "none",
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
    },
    [filter, language],
    { flip: true },
  )

  const onFilter = async (id: string) => {
    if (reduced || !listRef.current) {
      setFilter(id)
      return
    }
    const { gsap, Flip } = await loadGsap({ flip: true })
    if (!Flip || !listRef.current) {
      setFilter(id)
      return
    }
    const state = Flip.getState(listRef.current.querySelectorAll("[data-chapter]"))
    setFilter(id)
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.55,
        ease: "power2.out",
        absolute: true,
        stagger: 0.03,
        onEnter: (elements) =>
          gsap.fromTo(elements, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35 }),
        onLeave: (elements) => gsap.to(elements, { opacity: 0, duration: 0.2 }),
      })
    })
  }

  const resumeChapter = t.chapters.find((c) => c.id === resumeId)

  return (
    <div data-about-root ref={listRef} className="relative min-h-svh bg-[#EFECE6] text-[#12131A]">
      <svg
        className="pointer-events-none absolute left-6 top-0 hidden h-full w-8 lg:block"
        aria-hidden
        preserveAspectRatio="none"
      >
        <path
          data-thread-path
          d="M16 0 C 8 120, 24 240, 16 360 S 8 600, 16 800 S 24 1100, 16 1400 S 8 1800, 16 2200"
          fill="none"
          stroke="#1F4BFF"
          strokeWidth="2"
        />
      </svg>

      <header className="px-6 pb-16 pt-24 sm:px-12 sm:pt-28">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#12131A]/50">{t.aboutKicker}</p>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(3.4rem,9vw,7.5rem)] leading-[0.88] tracking-[-0.05em]">
          {t.aboutTitle}
          <span className="text-[#1F4BFF]">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[#12131A]/70">{t.aboutSub}</p>
        <p className="mt-4 font-mono text-sm text-[#1F4BFF]">
          <span className="font-display text-4xl tracking-[-0.04em] text-[#12131A]">{years}</span>{" "}
          {t.aboutYears}
        </p>

        {resumeChapter && (
          <button
            type="button"
            className="press mt-6 rounded-2xl border border-[#12131A]/15 bg-white/50 px-4 py-3 text-left"
            onClick={() => {
              document
                .querySelector(`[data-chapter-id="${resumeChapter.id}"]`)
                ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" })
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#1F4BFF]">{t.aboutResume}</p>
            <p className="mt-1 font-display text-xl tracking-[-0.03em]">{resumeChapter.title}</p>
            <p className="mt-1 font-mono text-xs text-[#12131A]/60">{t.aboutResumeCta}</p>
          </button>
        )}

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
                onClick={() => void onFilter(item.id)}
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
        <div className="absolute bottom-28 left-[1.35rem] top-0 w-px bg-[#12131A]/15 sm:left-12 lg:hidden" aria-hidden />
        {chapters.map((chapter) => (
          <li
            key={chapter.id}
            data-chapter={chapter.title}
            data-chapter-id={chapter.id}
            className="relative grid gap-4 border-t border-[#12131A]/10 py-12 md:grid-cols-[180px_1fr] md:gap-12"
          >
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#12131A]/55">
              <p>
                {chapter.year}
                {chapter.end ? ` — ${chapter.end}` : ""}
              </p>
              <p className="mt-2">{chapter.place}</p>
              <p
                className={`mt-3 inline-flex rounded-full px-2 py-1 text-[10px] ${
                  chapter.kind === "work" ? "text-white" : "text-[#12131A]"
                }`}
                style={{ backgroundColor: KIND_COLOR[chapter.kind] }}
              >
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

      <nav
        aria-label={t.aboutKicker}
        className="pointer-events-auto fixed right-8 top-1/2 z-[3] hidden -translate-y-1/2 lg:block"
      >
        <p className="mb-4 max-w-[9rem] text-right font-mono text-[11px] uppercase tracking-[0.16em] text-[#1F4BFF]">
          {current}
        </p>
        <ol className="space-y-3 text-right font-mono text-[10px] uppercase tracking-[0.14em]">
          {chapters.map((chapter) => {
            const active = chapter.title === current
            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  className={`press ${active ? "text-[#12131A]" : "text-[#12131A]/35"}`}
                  onClick={() => {
                    document
                      .querySelector(`[data-chapter-id="${chapter.id}"]`)
                      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" })
                  }}
                >
                  <span
                    className={`mr-2 inline-block h-px align-middle ${
                      active ? "w-8 bg-[#1F4BFF]" : "w-4 bg-[#12131A]/25"
                    }`}
                  />
                  {chapter.year}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
