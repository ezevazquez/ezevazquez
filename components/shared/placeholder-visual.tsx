"use client"

import { cn } from "@/lib/utils"

type PlaceholderVariant = "flow" | "dashboard" | "form" | "messages"

type PlaceholderVisualProps = {
  variant?: PlaceholderVariant
  className?: string
}

function ChromeBar() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
      <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
      <div className="ml-auto h-2 w-20 rounded-full bg-white/[0.06]" />
    </div>
  )
}

export function PlaceholderVisual({ variant = "dashboard", className }: PlaceholderVisualProps) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] rounded-2xl border border-white/[0.08] bg-zinc-950/90 overflow-hidden shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)]",
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.06] via-transparent to-transparent" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.06] rounded-2xl pointer-events-none" />
      <ChromeBar />

      {variant === "dashboard" && (
        <div className="p-5 grid grid-cols-12 gap-3 h-[calc(100%-44px)]">
          <div className="col-span-8 space-y-3">
            <div className="flex gap-2">
              <div className="h-16 flex-1 rounded-lg bg-white/[0.04] border border-white/[0.06] p-3">
                <div className="h-2 w-12 rounded bg-primary/30 mb-2" />
                <div className="h-5 w-8 rounded bg-white/10" />
              </div>
              <div className="h-16 flex-1 rounded-lg bg-white/[0.04] border border-white/[0.06]" />
            </div>
            <div className="h-24 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 flex items-end gap-1">
              {[40, 65, 45, 80, 55, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary/25"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="col-span-4 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-9 rounded-lg border px-2 flex items-center",
                  i === 1 ? "border-primary/25 bg-primary/10" : "border-white/[0.06] bg-white/[0.02]"
                )}
              >
                <div className="h-1.5 flex-1 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === "flow" && (
        <div className="p-6 flex items-center justify-center gap-3 h-[calc(100%-44px)]">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={cn(
                  "h-12 w-12 rounded-xl border flex flex-col items-center justify-center gap-1",
                  n === 3
                    ? "border-primary/40 bg-primary/15 shadow-[0_0_24px_-4px_rgba(59,130,246,0.4)]"
                    : "border-white/[0.08] bg-white/[0.03]"
                )}
              >
                <div className="h-1 w-4 rounded bg-white/20" />
                <div className="h-1 w-3 rounded bg-white/10" />
              </div>
              {n < 5 && (
                <div className="hidden sm:block w-6 h-px bg-gradient-to-r from-primary/50 to-white/10" />
              )}
            </div>
          ))}
        </div>
      )}

      {variant === "form" && (
        <div className="p-8 flex flex-col justify-center h-[calc(100%-44px)] max-w-[220px] mx-auto w-full">
          <div className="h-2.5 w-2/3 rounded bg-white/15 mx-auto mb-6" />
          <div className="space-y-3">
            <div className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center">
              <div className="h-1.5 w-full rounded bg-white/10" />
            </div>
            <div className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.03]" />
            <div className="h-10 rounded-lg bg-gradient-to-r from-blue-600/40 to-blue-500/30 border border-primary/30" />
          </div>
        </div>
      )}

      {variant === "messages" && (
        <div className="p-5 space-y-3 h-[calc(100%-44px)] flex flex-col justify-end">
          <div className="ml-auto max-w-[72%] rounded-2xl rounded-tr-md px-3 py-2.5 bg-primary/20 border border-primary/25">
            <div className="h-1.5 w-full rounded bg-primary/30 mb-1" />
            <div className="h-1.5 w-2/3 rounded bg-primary/20" />
          </div>
          <div className="max-w-[68%] rounded-2xl rounded-tl-md px-3 py-2.5 bg-white/[0.06] border border-white/[0.08]">
            <div className="h-1.5 w-full rounded bg-white/15" />
          </div>
          <div className="ml-auto max-w-[55%] rounded-2xl rounded-tr-md px-3 py-2 bg-white/[0.05]" />
          <div className="max-w-[78%] rounded-2xl rounded-tl-md px-3 py-3 bg-primary/10 border border-primary/20">
            <div className="h-1.5 w-4/5 rounded bg-primary/25" />
          </div>
        </div>
      )}
    </div>
  )
}
