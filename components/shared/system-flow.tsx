"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

export type FlowNode = {
  label: string
  description?: string
}

type SystemFlowProps = {
  nodes: FlowNode[]
  className?: string
}

export function SystemFlow({ nodes, className }: SystemFlowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const reduced = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(reduced ? nodes.length - 1 : -1)

  useEffect(() => {
    if (reduced || !isInView) return
    setActiveIndex(-1)
    const timers = nodes.map((_, i) =>
      window.setTimeout(() => setActiveIndex(i), i * 200)
    )
    return () => timers.forEach(clearTimeout)
  }, [isInView, reduced, nodes])

  const nodeClass = (active: boolean) =>
    cn(
      "rounded-xl border px-3 py-4 text-center transition-all duration-500 ease-out",
      active
        ? "border-primary/40 bg-primary/[0.12] shadow-[0_0_28px_-8px_rgba(59,130,246,0.45)] scale-[1.02]"
        : "border-white/[0.08] bg-white/[0.02]"
    )

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div className="hidden xl:flex items-stretch gap-1.5 justify-between">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center flex-1 min-w-0">
            <motion.div
              className={nodeClass(activeIndex >= i || reduced)}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: reduced ? 0 : i * 0.1, duration: 0.5 }}
            >
              <p className="text-xs font-semibold text-white truncate">{node.label}</p>
              {node.description && (
                <p className="text-[10px] text-gray-400 mt-1.5 leading-tight line-clamp-2">
                  {node.description}
                </p>
              )}
            </motion.div>
            {i < nodes.length - 1 && <FlowConnector active={activeIndex > i} reduced={reduced} />}
          </div>
        ))}
      </div>

      <div className="hidden lg:flex xl:hidden flex-wrap gap-3 justify-center">
        {nodes.map((node, i) => (
          <motion.div
            key={node.label}
            className={cn(nodeClass(activeIndex >= i || reduced), "min-w-[100px] flex-1 max-w-[140px]")}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: reduced ? 0 : i * 0.08 }}
          >
            <p className="text-xs font-semibold">{node.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="lg:hidden flex flex-col gap-3">
        {nodes.map((node, i) => (
          <motion.div
            key={node.label}
            className={cn(
              "rounded-xl border px-4 py-4 flex items-center gap-4 transition-all duration-500",
              activeIndex >= i || reduced
                ? "border-primary/40 bg-primary/[0.1]"
                : "border-white/[0.08] bg-white/[0.02]"
            )}
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: reduced ? 0 : i * 0.08 }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{node.label}</p>
              {node.description && (
                <p className="text-xs text-gray-400 mt-0.5">{node.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function FlowConnector({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <div className="relative mx-1 h-5 w-7 shrink-0 overflow-hidden" aria-hidden>
      <motion.span
        className="absolute left-0 top-1/2 h-px w-full origin-left bg-primary/45"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active || reduced ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.35 }}
      />
      {!reduced && active && (
        <motion.span
          className="absolute top-[7px] h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.9)]"
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.7, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
        />
      )}
    </div>
  )
}
