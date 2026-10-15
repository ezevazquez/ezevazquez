"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useCopy } from "@/lib/redesign/use-copy"
import { TransitionLink } from "./transition-link"
import { useTransitionNav } from "./transition-context"

const TABS = [
  { href: "/", id: "root" },
  { href: "/about", id: "about" },
  { href: "/work", id: "work" },
  { href: "/contact", id: "contact" },
] as const

function activeIndex(pathname: string) {
  if (pathname.startsWith("/about")) return 1
  if (pathname.startsWith("/work")) return 2
  if (pathname.startsWith("/contact")) return 3
  return 0
}

export function BottomNav() {
  const pathname = usePathname()
  const { navigate, setPreviewHref, previewHref } = useTransitionNav()
  const { t } = useCopy()
  const trackRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const drag = useRef({ active: false, moved: false, startX: 0 })
  const [hydrated, setHydrated] = useState(false)
  const current = activeIndex(pathname)
  const [preview, setPreview] = useState<number | null>(null)
  const [box, setBox] = useState<{ left: number; width: number } | null>(null)
  const [focusIndex, setFocusIndex] = useState(current)
  const index = preview ?? current

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    setFocusIndex(current)
  }, [current])

  useEffect(() => {
    if (!hydrated) return
    const measure = () => {
      const track = trackRef.current
      const tab = tabRefs.current[index]
      if (!track || !tab) return
      const trackBox = track.getBoundingClientRect()
      const tabBox = tab.getBoundingClientRect()
      setBox({ left: tabBox.left - trackBox.left, width: tabBox.width })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [index, pathname, hydrated])

  const indexFromPointer = (clientX: number) => {
    const track = trackRef.current
    if (!track) return current
    const rect = track.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    return Math.min(TABS.length - 1, Math.max(0, Math.floor(ratio * TABS.length)))
  }

  const cancelPreview = () => {
    drag.current = { active: false, moved: false, startX: 0 }
    setPreview(null)
    setPreviewHref(null)
  }

  return (
    <nav aria-label={t.navLabel} className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2">
      {previewHref && (
        <p
          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#12131A]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F4F1EA]/80"
          aria-hidden
        >
          {previewHref === "/" ? "root" : previewHref.replace("/", "")}
        </p>
      )}
      <div
        ref={trackRef}
        role="tablist"
        className="relative flex items-center rounded-full border border-[#F4F1EA]/15 bg-[#12131A]/80 p-1 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md"
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("a")) return
          drag.current = { active: true, moved: false, startX: event.clientX }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!drag.current.active) return
          if (Math.abs(event.clientX - drag.current.startX) > 8) {
            drag.current.moved = true
            const next = indexFromPointer(event.clientX)
            setPreview(next)
            setPreviewHref(TABS[next].href)
          }
        }}
        onPointerUp={(event) => {
          if (!drag.current.active) return
          const moved = drag.current.moved
          const next = indexFromPointer(event.clientX)
          drag.current.active = false
          setPreview(null)
          setPreviewHref(null)
          if (moved) {
            drag.current.moved = false
            navigate(TABS[next].href)
          } else {
            drag.current.moved = false
          }
        }}
        onPointerCancel={cancelPreview}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            cancelPreview()
            return
          }
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
            return
          }
          // Only when focus is inside the nav
          if (!trackRef.current?.contains(document.activeElement)) return
          event.preventDefault()
          let next = focusIndex
          if (event.key === "ArrowRight") next = Math.min(TABS.length - 1, focusIndex + 1)
          if (event.key === "ArrowLeft") next = Math.max(0, focusIndex - 1)
          if (event.key === "Home") next = 0
          if (event.key === "End") next = TABS.length - 1
          setFocusIndex(next)
          tabRefs.current[next]?.focus()
        }}
      >
        {box && (
          <span
            aria-hidden
            className="absolute top-1 bottom-1 rounded-full bg-[#1F4BFF]"
            style={{
              left: box.left,
              width: box.width,
              transition:
                preview === null
                  ? "left 450ms cubic-bezier(0.16, 1, 0.3, 1), width 450ms cubic-bezier(0.16, 1, 0.3, 1)"
                  : "none",
            }}
          />
        )}
        {TABS.map((tab, tabIndex) => {
          const selected = tabIndex === current
          return (
            <TransitionLink
              key={tab.id}
              href={tab.href}
              role="tab"
              tabIndex={tabIndex === focusIndex ? 0 : -1}
              ref={(node) => {
                tabRefs.current[tabIndex] = node
              }}
              aria-current={selected ? "page" : undefined}
              aria-selected={selected}
              onFocus={() => setFocusIndex(tabIndex)}
              onClick={(event) => {
                if (drag.current.moved) {
                  event.preventDefault()
                  drag.current.moved = false
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  // TransitionLink handles click; ensure Space activates
                  if (event.key === " ") {
                    event.preventDefault()
                    navigate(tab.href)
                  }
                }
              }}
              className={`nav-tab relative z-[1] rounded-full px-3 py-2 font-mono text-[11px] lowercase tracking-wide sm:px-4 sm:text-xs ${
                tabIndex === index ? "text-white" : "text-[#F4F1EA]/70"
              }`}
            >
              {tab.id}
            </TransitionLink>
          )
        })}
      </div>
    </nav>
  )
}
