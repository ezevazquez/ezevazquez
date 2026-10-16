"use client"

import { useEffect, useRef, useState } from "react"
import { useCopy } from "@/lib/redesign/use-copy"

const MESSAGE_DURATION = 10_000

type CursorPosition = { x: number; y: number }

export function SaySomething() {
  const { t } = useCopy()
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState("")
  const [draft, setDraft] = useState("")
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 })
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const timerRef = useRef<number>()

  useEffect(() => {
    const updatePosition = (event: PointerEvent) => {
      if (!editing) setPosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("pointermove", updatePosition, { passive: true })
    return () => window.removeEventListener("pointermove", updatePosition)
  }, [editing])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (!editing) {
      delete document.documentElement.dataset.saySomethingOpen
      return
    }
    document.documentElement.dataset.saySomethingOpen = "true"
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (formRef.current?.contains(event.target as Node)) return
      setEditing(false)
      setDraft("")
    }
    document.addEventListener("pointerdown", closeOnOutsidePointer, true)
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer, true)
      delete document.documentElement.dataset.saySomethingOpen
    }
  }, [editing])

  useEffect(() => {
    const reset = () => {
      window.clearTimeout(timerRef.current)
      setEditing(false)
      setMessage("")
      setDraft("")
      setPosition({ x: 0, y: 0 })
    }
    window.addEventListener("eze:reset-hero", reset)
    return () => window.removeEventListener("eze:reset-hero", reset)
  }, [])

  useEffect(() => {
    const startAtPointer = (event: Event) => {
      const detail = (event as CustomEvent<CursorPosition>).detail
      if (detail) setPosition(detail)
      start()
    }
    window.addEventListener("eze:say-something", startAtPointer)
    return () => window.removeEventListener("eze:say-something", startAtPointer)
  })

  const start = () => {
    window.clearTimeout(timerRef.current)
    setMessage("")
    setEditing(true)
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  const cancel = () => {
    setEditing(false)
    setDraft("")
  }

  const send = () => {
    const next = draft.trim()
    if (!next) return cancel()
    setEditing(false)
    setMessage(next)
    setDraft("")
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setMessage(""), MESSAGE_DURATION)
  }

  return (
    <>
      {(editing || message) && (
        <form
          ref={formRef}
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
          className="pointer-events-auto fixed z-[70]"
          style={{ left: position.x + 12, top: position.y + 12 }}
        >
          {editing ? (
            <label className="flex items-center gap-2 rounded-full border-2 border-signal bg-paper px-3 py-2 shadow-[0_0_0_4px_rgb(var(--primitive-signal)/0.16),0_12px_32px_rgb(var(--primitive-black)/0.35)] transition-shadow focus-within:shadow-[0_0_0_5px_rgb(var(--primitive-signal)/0.24),0_14px_36px_rgb(var(--primitive-black)/0.4)]">
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") cancel()
                }}
                maxLength={96}
                aria-label={t.saySomething}
                placeholder={t.sayPlaceholder}
                className="w-48 select-text bg-transparent font-mono text-xs text-canvas outline-none placeholder:text-canvas/45 sm:w-56"
              />
            </label>
          ) : (
            <p className="max-w-[16rem] rounded-2xl rounded-bl-sm border-2 border-paper bg-canvas px-3 py-2 font-mono text-xs leading-relaxed text-paper shadow-xl">
              {message}
            </p>
          )}
        </form>
      )}
    </>
  )
}
