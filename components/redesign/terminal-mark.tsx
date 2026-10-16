"use client"

import { useEffect, useState } from "react"
import { useCopy } from "@/lib/redesign/use-copy"

type TerminalMarkProps = {
  className?: string
  isStatic?: boolean
  "data-loader-sig"?: boolean
  "data-logo-sig"?: boolean
}

export function TerminalMark({
  className = "",
  isStatic = false,
  ...dataAttrs
}: TerminalMarkProps) {
  const { t } = useCopy()
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (isStatic) return
    const id = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 450)
    return () => clearInterval(id)
  }, [isStatic])

  if (dataAttrs["data-logo-sig"] || isStatic) {
    // Header dock version
    return (
      <span
        {...(dataAttrs["data-logo-sig"] ? { "data-logo-sig": "" } : {})}
        className={`group inline-flex items-center gap-1 font-mono text-sm sm:text-base font-semibold tracking-tight text-paper ${className}`}
      >
        <span className="text-signal font-bold">[</span>
        <span className="group-hover:text-signal transition-colors">eze:~$</span>
        <span className="inline-block animate-pulse text-signal">▍</span>
        <span className="text-signal font-bold">]</span>
      </span>
    )
  }

  // Loader window version
  return (
    <div
      {...(dataAttrs["data-loader-sig"] ? { "data-loader-sig": "" } : {})}
      className={`relative w-[min(90vw,520px)] rounded-2xl border border-white/15 bg-canvas/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
          <span className="ml-2 text-[11px] text-paper/55">{t.terminalMark.location}</span>
        </div>
        <span className="rounded bg-paper px-2 py-0.5 text-[10px] uppercase tracking-wider text-canvas font-mono">
          {t.terminalMark.status}
        </span>
      </div>

      {/* Terminal Content */}
      <div className="mt-4 space-y-2.5 font-mono text-left text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-paper">
          <span className="font-bold">$</span>
          <span className="text-paper font-medium">{t.terminalMark.command}</span>
        </div>

        <div className="space-y-1 text-[11px] sm:text-xs text-paper/60">
          <p className="flex items-center gap-1.5">
            <span className="text-success">✔</span> {t.terminalMark.runtime}
          </p>
          <p className="flex items-center gap-1.5">
            <span className="text-success">✔</span> {t.terminalMark.systems}
          </p>
          <p className="flex items-center gap-1.5">
            <span className="text-paper/80">→</span> {t.terminalMark.initializing}{dots}
          </p>
        </div>

        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-paper">
              EZE VAZQUEZ
            </span>
            <span className="font-mono text-xs text-paper">
              [OK]
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
