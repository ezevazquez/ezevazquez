"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "./toast-provider"
import { useCopy } from "@/lib/redesign/use-copy"

export type WallNote = {
  id: string
  author: string
  content: string
  date: string
  color: string
  rotate: number
  x?: number
  y?: number
}

const STORAGE_KEY = "eze_wall_notes_v1"

const INITIAL_NOTES: WallNote[] = [
  {
    id: "n-1",
    author: "Eze",
    content: "¡Bienvenidos al lienzo! Dejá tu nota, arrastrá stickers o pegate unos trazos con el lápiz ✌️",
    date: "16 Oct",
    color: "var(--color-action)",
    rotate: -3,
  },
  {
    id: "n-2",
    author: "Mike",
    content: "Gran laburo con la automatización de sprints. Nos ahorró horas de reportes.",
    date: "15 Oct",
    color: "var(--color-success)",
    rotate: 4,
  },
  {
    id: "n-3",
    author: "Santi",
    content: "¿El fernet va 70/30 o 60/40? Debate técnico obligatorio 🧉",
    date: "14 Oct",
    color: "var(--color-warning)",
    rotate: -2,
  },
]

export function WallNotes() {
  const { language } = useCopy()
  const { showToast } = useToast()
  const [notes, setNotes] = useState<WallNote[]>(INITIAL_NOTES)
  const [openForm, setOpenForm] = useState(false)
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const saveNotes = (updated: WallNote[]) => {
    setNotes(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const newNote: WallNote = {
      id: `note-${Date.now()}`,
      author: author.trim() || (language === "es" ? "Visitante anónimo" : "Anonymous"),
      content: content.trim(),
      date: new Date().toLocaleDateString(language === "es" ? "es-AR" : "en-US", {
        day: "numeric",
        month: "short",
      }),
      color: ["var(--color-action)", "var(--color-warning)", "var(--color-success)", "var(--color-action-strong)"][Math.floor(Math.random() * 4)],
      rotate: (Math.random() - 0.5) * 8,
    }

    const next = [newNote, ...notes]
    saveNotes(next)
    setContent("")
    setAuthor("")
    setOpenForm(false)
    showToast({
      message: language === "es" ? "Nota pegada en el muro 📌" : "Note pinned to wall 📌",
      icon: "📌",
      type: "success",
    })
  }

  return (
    <div className="relative">
      {/* Trigger button */}
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => setOpenForm(!openForm)}
          className="press flex items-center gap-2 rounded-full border border-white/15 bg-canvas/85 px-4 py-2 font-mono text-xs text-paper shadow-xl backdrop-blur-md hover:border-white/30 hover:bg-canvas-hover"
        >
          <span>💬</span>
          <span>
            {openForm
              ? (language === "es" ? "Cerrar libro de visitas" : "Close guestbook")
              : (language === "es" ? "Dejar nota en el muro" : "Leave a note on the wall")}
          </span>
          <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px] text-paper/70">
            {notes.length}
          </span>
        </button>
      </div>

      {/* Form Modal / Floating Panel */}
      <AnimatePresence>
        {openForm && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-4 w-[min(100%,22rem)] rounded-2xl border border-white/15 bg-canvas-elevated/95 p-5 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-mono text-xs uppercase tracking-wider text-signal font-semibold">
                {language === "es" ? "Libro de visitas · Hot takes" : "Guestbook · Leave a note"}
              </span>
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="text-xs font-mono text-white/50 hover:text-white"
                aria-label={language === "es" ? "Cerrar libro de visitas" : "Close guestbook"}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-3 space-y-3 font-mono text-xs">
              <div>
                <label htmlFor="wall-note-content" className="sr-only">
                  {language === "es" ? "Tu nota" : "Your note"}
                </label>
                <textarea
                  id="wall-note-content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    language === "es"
                      ? "Dejá un mensaje para todos los que visiten la web…"
                      : "Leave a note for everyone who visits…"
                  }
                  rows={3}
                  maxLength={180}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-paper placeholder-white/30 focus:border-signal focus:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                />
              </div>

              <div className="flex gap-2">
                <label htmlFor="wall-note-author" className="sr-only">
                  {language === "es" ? "Tu nombre o usuario" : "Your name or handle"}
                </label>
                <input
                  id="wall-note-author"
                  name="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={language === "es" ? "tu nombre / twitter" : "your name / handle"}
                  maxLength={30}
                  autoComplete="nickname"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-paper placeholder-white/30 focus:border-signal focus:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                />
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="press rounded-xl bg-signal px-4 py-2 font-mono text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-signal-hover"
                >
                  {language === "es" ? "Postear" : "Post"}
                </button>
              </div>
            </form>

            {/* Recent Notes Stream */}
            <div className="mt-4 max-h-48 space-y-2.5 overflow-y-auto pr-1 border-t border-white/5 pt-3">
              <p className="font-mono text-[10px] uppercase text-white/40 tracking-wider">
                {language === "es" ? "Últimas notas:" : "Recent notes:"}
              </p>
              {notes.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className="rounded-xl border border-white/5 bg-white/5 p-2.5 text-left font-mono"
                >
                  <p className="text-xs text-paper leading-relaxed">&ldquo;{n.content}&rdquo;</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-white/40">
                    <span className="text-signal font-medium">@{n.author}</span>
                    <span>{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
