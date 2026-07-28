"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function SystemBackground() {
  const reduced = useReducedMotion()

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 system-grid opacity-50" />
      <motion.div
        className="absolute -top-48 left-[8%] h-[34rem] w-[34rem] rounded-full bg-blue-500/[0.12] blur-3xl"
        animate={reduced ? undefined : { x: [0, 56, 0], y: [0, 32, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[38%] -right-48 h-[30rem] w-[30rem] rounded-full bg-cyan-400/[0.07] blur-3xl"
        animate={reduced ? undefined : { x: [0, -48, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
        <motion.path
          d="M-80 220 C 320 80, 520 360, 960 190 S 1440 240, 1600 80"
          fill="none"
          stroke="rgba(96,165,250,0.35)"
          strokeWidth="1"
          strokeDasharray="5 16"
          animate={reduced ? undefined : { strokeDashoffset: [0, -120] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  )
}
