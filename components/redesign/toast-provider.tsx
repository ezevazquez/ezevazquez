"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useCopy } from "@/lib/redesign/use-copy"

export type ToastItem = {
  id: string
  message: string
  icon?: string
  type?: "info" | "success" | "warning" | "radio"
  duration?: number
}

type ToastContextType = {
  showToast: (item: Omit<ToastItem, "id"> | string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Fallback to custom event if outside provider
    return {
      showToast: (item: Omit<ToastItem, "id"> | string) => {
        const detail = typeof item === "string" ? { message: item } : item
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("eze:toast", { detail }))
        }
      },
    }
  }
  return ctx
}

export function toast(item: Omit<ToastItem, "id"> | string) {
  const detail = typeof item === "string" ? { message: item } : item
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("eze:toast", { detail }))
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useCopy()
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (item: Omit<ToastItem, "id"> | string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const raw = typeof item === "string" ? { message: item } : item
      const newToast: ToastItem = {
        id,
        duration: 2600,
        ...raw,
      }

      setToasts((prev) => [newToast, ...prev.slice(0, 2)]) // Max 3 toasts stacked

      window.setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    },
    [removeToast],
  )

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<Omit<ToastItem, "id"> | string>
      if (customEvent.detail) {
        showToast(customEvent.detail)
      }
    }
    window.addEventListener("eze:toast", handler)
    return () => window.removeEventListener("eze:toast", handler)
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <aside
        aria-label={t.notificationsLabel}
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="pointer-events-none fixed top-5 left-1/2 z-[99] flex -translate-x-1/2 flex-col items-center gap-2 max-w-[92vw]"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className={`pointer-events-auto flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-xs shadow-2xl backdrop-blur-xl ${
                t.type === "radio"
                  ? "border-signal/40 bg-canvas-elevated/95 text-paper"
                  : "border-white/15 bg-canvas/95 text-paper"
              }`}
            >
              {t.icon && <span className="text-sm select-none">{t.icon}</span>}
              <span className="font-medium tracking-wide">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  )
}
