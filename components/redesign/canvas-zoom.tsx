"use client"

import { useCopy } from "@/lib/redesign/use-copy"

type CanvasZoomProps = { value: number; onChange: (value: number) => void }

export function CanvasZoom({ value, onChange }: CanvasZoomProps) {
  const { t } = useCopy()
  return (
    <div className="fixed bottom-5 left-5 z-[60] hidden rounded-full border border-paper/15 bg-canvas/85 px-4 py-3 shadow-xl backdrop-blur-md sm:block">
      <input type="range" min="0.5" max="1" step="0.05" value={value} onChange={(event) => onChange(Number(event.target.value))} aria-label={t.controls.zoom} className="h-3 w-48 cursor-ew-resize accent-signal" />
    </div>
  )
}
