"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useToast } from "./toast-provider"

type Point = { x: number; y: number }
type Stroke = {
  points: Point[]
  color: string
  width: number
}

const COLORS = [
  { id: "white", cssColor: "var(--color-paper)", label: "Tiza" },
  { id: "signal", cssColor: "var(--color-action)", label: "Azul" },
  { id: "yellow", cssColor: "var(--color-warning)", label: "Amarillo" },
  { id: "green", cssColor: "var(--color-success)", label: "Verde" },
]

function resolveCanvasColor(color: string) {
  if (!color.startsWith("var(")) return color
  const token = color.slice(4, -1)
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim()
}

export function DrawWall() {
  const { showToast } = useToast()
  const [active, setActive] = useState(false)
  const [color, setColor] = useState("var(--color-paper)")
  const [width, setWidth] = useState(3)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const isDrawing = useRef(false)
  const currentPoints = useRef<Point[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const drawAll = useCallback(
    (ctx: CanvasRenderingContext2D, list: Stroke[]) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      list.forEach((stroke) => {
        if (stroke.points.length < 2) return
        ctx.strokeStyle = resolveCanvasColor(stroke.color)
        ctx.lineWidth = stroke.width
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.beginPath()
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
        }
        ctx.stroke()
      })
    },
    [],
  )

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
      drawAll(ctx, strokes)
    }
  }, [drawAll, strokes])

  useEffect(() => {
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [resize])

  const toggleDrawing = () => {
    if (!active) {
      setActive(true)
      showToast({ message: "Modo dibujo activado ✏️", icon: "✏️", type: "info" })
    } else {
      setActive(false)
    }
  }

  const clearCanvas = () => {
    setStrokes([])
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    showToast({ message: "Lienzo limpiado 🧹", icon: "🧹", type: "info" })
  }

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active || e.button !== 0) return
    isDrawing.current = true
    const rect = e.currentTarget.getBoundingClientRect()
    const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    currentPoints.current = [pt]
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const moveDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !active) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    currentPoints.current.push(pt)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = resolveCanvasColor(color)
    ctx.lineWidth = width
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    const len = currentPoints.current.length
    if (len >= 2) {
      const p1 = currentPoints.current[len - 2]
      const p2 = currentPoints.current[len - 1]
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }
  }

  const endDraw = () => {
    if (!isDrawing.current) return
    isDrawing.current = false
    if (currentPoints.current.length > 1) {
      const newStroke: Stroke = {
        points: [...currentPoints.current],
        color,
        width,
      }
      setStrokes((prev) => [...prev, newStroke])
    }
    currentPoints.current = []
  }

  return (
    <>
      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        onPointerDown={startDraw}
        onPointerMove={moveDraw}
        onPointerUp={endDraw}
        onPointerCancel={endDraw}
        className={`absolute inset-0 z-25 h-full w-full touch-none ${
          active
            ? "pointer-events-auto cursor-crosshair opacity-90"
            : "pointer-events-none opacity-80"
        }`}
      />

      {/* Floating Draw Mode Trigger & Controls */}
      <div className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end gap-2">
        {active && (
          <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-canvas/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Palette */}
            <div className="flex items-center gap-1.5 px-1 border-r border-white/10 pr-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.cssColor)}
                  title={c.label}
                  aria-label={c.label}
                  style={{ backgroundColor: c.cssColor }}
                  className={`h-5 w-5 rounded-full transition-transform ${
                    color === c.cssColor ? "scale-125 ring-2 ring-white/50" : "hover:scale-110 opacity-70"
                  }`}
                />
              ))}
            </div>

            {/* Sizes */}
            <div className="flex items-center gap-1 px-1 border-r border-white/10 pr-2">
              {[2, 5, 10].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setWidth(s)}
                  className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-mono text-paper transition-colors ${
                    width === s ? "bg-signal" : "hover:bg-white/10"
                  }`}
                >
                  {s === 2 ? "•" : s === 5 ? "●" : "⬤"}
                </button>
              ))}
            </div>

            {/* Clear */}
            <button
              type="button"
              onClick={clearCanvas}
              title="Limpiar trazos"
              className="press rounded-lg px-2.5 py-1 font-mono text-xs text-paper/80 hover:bg-white/10 hover:text-paper"
            >
              🧹 Limpiar
            </button>
          </div>
        )}

        {/* Draw Toggle Button (Pill style like milo.gg) */}
        <button
          type="button"
          onClick={toggleDrawing}
          className={`press group flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs font-semibold shadow-xl backdrop-blur-md transition-all ${
            active
              ? "border-signal bg-signal text-white"
              : "border-white/15 bg-canvas/85 text-paper hover:border-white/30 hover:bg-canvas-elevated"
          }`}
        >
          <span className="text-sm">{active ? "✔" : "✏️"}</span>
          <span>{active ? "Listo" : "Dibujar en la pared"}</span>
        </button>
      </div>
    </>
  )
}
