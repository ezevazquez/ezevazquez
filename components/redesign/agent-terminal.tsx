"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import { useCopy } from "@/lib/redesign/use-copy"

export function AgentTerminal() {
  const { t } = useCopy()
  const [command, setCommand] = useState("")
  const [lines, setLines] = useState<string[]>([])
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null)

  useEffect(() => {
    const reset = () => {
      setCommand("")
      setLines([])
      setPosition({ x: 0, y: 0 })
      drag.current = null
    }
    window.addEventListener("eze:reset-hero", reset)
    return () => window.removeEventListener("eze:reset-hero", reset)
  }, [])

  const run = () => {
    const value = command.trim()
    if (!value) return
    setLines((current) => [...current.slice(-2), `$ ${value}`, t.agentTerminal.response])
    setCommand("")
  }

  return (
    <section
      data-cursor="view"
      data-agent-terminal
      className="absolute right-[3%] top-[54%] z-40 hidden w-56 overflow-hidden rounded-2xl border border-paper/25 bg-canvas font-mono shadow-[8px_12px_0_rgb(var(--primitive-black)/0.35)] lg:block"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      onPointerDown={(event: PointerEvent<HTMLElement>) => {
        if ((event.target as HTMLElement).closest("input, button")) return
        drag.current = { x: position.x, y: position.y, startX: event.clientX, startY: event.clientY }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event: PointerEvent<HTMLElement>) => {
        if (!drag.current) return
        setPosition({ x: drag.current.x + event.clientX - drag.current.startX, y: drag.current.y + event.clientY - drag.current.startY })
      }}
      onPointerUp={() => { drag.current = null }}
    >
      <div className="flex items-center gap-1.5 border-b border-paper/15 bg-canvas-raised px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-paper/55">
        <span className="h-2 w-2 rounded-full bg-danger" /><span className="h-2 w-2 rounded-full bg-warning" /><span className="h-2 w-2 rounded-full bg-success" />
        <span className="ml-1">{t.agentTerminal.title}</span>
      </div>
      <div className="p-3">
      <div className="min-h-12 space-y-1 text-[10px] leading-relaxed text-paper/75" aria-live="polite">
        {lines.length ? lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>) : <p>{t.agentTerminal.empty}</p>}
      </div>
      <form
        className="mt-3 flex border-t border-paper/15 pt-2"
        onSubmit={(event) => {
          event.preventDefault()
          run()
        }}
      >
        <label className="sr-only" htmlFor="agent-command">{t.agentTerminal.commandLabel}</label>
        <span className="mr-1 text-signal">›</span>
        <input id="agent-command" value={command} onChange={(event) => setCommand(event.target.value)} placeholder={t.agentTerminal.placeholder} className="min-w-0 flex-1 rounded bg-paper/10 px-1.5 py-1 text-[10px] text-paper outline-none placeholder:text-paper/35 focus:bg-paper/15" />
      </form>
      </div>
    </section>
  )
}
