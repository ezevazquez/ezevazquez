"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Copy, Instagram, Mail, MessageCircle, RotateCcw, Sparkles } from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const frameClass =
  "relative h-28 w-full overflow-hidden rounded-xl border border-white/[0.07] bg-black/40"

type ProblemVisualProps = {
  index: number
}

export function ProblemVisual({ index }: ProblemVisualProps) {
  const reduced = useReducedMotion()
  const visuals = [
    ScatteredInquiries,
    RepeatedAnswers,
    QuietWebsite,
    ManualHandoff,
    FadingReminders,
    UnclearAI,
  ]
  const Visual = visuals[index % visuals.length]

  return (
    <div className={frameClass} aria-hidden>
      <Visual reduced={reduced} />
    </div>
  )
}

type VisualProps = { reduced: boolean }

function ScatteredInquiries({ reduced }: VisualProps) {
  const channels = [
    { Icon: MessageCircle, x: "12%", y: "22%", drift: [0, -6, 0] },
    { Icon: Instagram, x: "58%", y: "16%", drift: [0, 7, 0] },
    { Icon: Mail, x: "34%", y: "58%", drift: [0, -5, 0] },
  ]

  return (
    <div className="absolute inset-0">
      {channels.map(({ Icon, x, y, drift }, i) => (
        <motion.div
          key={x}
          className="absolute flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/80 text-gray-500"
          style={{ left: x, top: y }}
          animate={reduced ? undefined : { y: drift, opacity: [0.9, 0.45, 0.9] }}
          transition={{ duration: 3.2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="h-4 w-4" />
        </motion.div>
      ))}
      {!reduced &&
        [0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="absolute h-1.5 w-1.5 rounded-full bg-rose-400/70"
            style={{ left: `${26 + dot * 22}%`, top: "80%" }}
            animate={{ opacity: [0, 1, 0], y: [0, 10, 16] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: dot * 0.7 }}
          />
        ))}
    </div>
  )
}

function RepeatedAnswers({ reduced }: VisualProps) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 px-5">
      {[0, 1, 2].map((row) => (
        <motion.div
          key={row}
          className="flex items-center gap-2"
          animate={reduced ? undefined : { opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: row * 0.5 }}
        >
          <span className="h-6 w-6 shrink-0 rounded-full border border-white/10 bg-zinc-900/80" />
          <span className="h-2 flex-1 rounded-full bg-white/10" style={{ maxWidth: "70%" }} />
        </motion.div>
      ))}
      <motion.span
        className="absolute right-4 top-4 text-rose-300/70"
        animate={reduced ? undefined : { rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </motion.span>
    </div>
  )
}

function QuietWebsite({ reduced }: VisualProps) {
  return (
    <div className="absolute inset-0 p-4">
      <div className="flex h-full flex-col rounded-lg border border-white/10 bg-zinc-950/70">
        <div className="flex items-center gap-1 border-b border-white/[0.06] px-2.5 py-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-1.5 w-1.5 rounded-full bg-white/15" />
          ))}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1.5 px-3">
          <span className="h-2 w-2/3 rounded-full bg-white/12" />
          <span className="h-1.5 w-1/2 rounded-full bg-white/[0.07]" />
        </div>
        {!reduced && (
          <motion.span
            className="absolute bottom-6 right-7 h-2 w-2 rounded-full bg-white/50"
            animate={{ scale: [1, 0.7, 1], opacity: [0.7, 0.2, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  )
}

function ManualHandoff({ reduced }: VisualProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-between px-5">
      <span className="h-16 w-16 rounded-lg border border-white/10 bg-zinc-900/70" />
      <div className="relative flex-1 px-3">
        <span className="block h-px w-full bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0_5px,transparent_5px_11px)]" />
        <motion.span
          className="absolute -top-3 flex h-6 w-6 items-center justify-center rounded-md border border-rose-400/30 bg-rose-500/10 text-rose-200/80"
          animate={reduced ? undefined : { left: ["8%", "62%", "8%"] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Copy className="h-3 w-3" />
        </motion.span>
      </div>
      <span className="h-16 w-16 rounded-lg border border-white/10 bg-zinc-900/70" />
    </div>
  )
}

function FadingReminders({ reduced }: VisualProps) {
  return (
    <div className="absolute inset-0 flex items-center gap-2.5 px-5">
      {[0, 1, 2, 3].map((note) => (
        <motion.div
          key={note}
          className="flex h-16 flex-1 flex-col justify-end rounded-md border border-white/[0.08] bg-zinc-900/60 p-2"
          animate={reduced ? undefined : { opacity: [1, 0.15, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, delay: note * 0.6 }}
        >
          <span className="h-1 w-full rounded-full bg-white/12" />
          <span className="mt-1 h-1 w-2/3 rounded-full bg-white/[0.08]" />
        </motion.div>
      ))}
      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-300/70" />
    </div>
  )
}

function UnclearAI({ reduced }: VisualProps) {
  const nodes = [
    { left: "18%", top: "28%" },
    { left: "46%", top: "62%" },
    { left: "72%", top: "30%" },
  ]

  return (
    <div className="absolute inset-0">
      {nodes.map((node, i) => (
        <motion.span
          key={node.left}
          className="absolute h-2.5 w-2.5 rounded-full border border-white/20 bg-zinc-800"
          style={node}
          animate={reduced ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.45 }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 text-gray-500"
        animate={reduced ? undefined : { rotate: [0, 8, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-4 w-4" />
      </motion.div>
      <span className="absolute bottom-3 right-4 text-[11px] font-semibold text-gray-600">?</span>
    </div>
  )
}
