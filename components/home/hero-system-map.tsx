"use client"

import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  Check,
  FileSpreadsheet,
  Instagram,
  KanbanSquare,
  Linkedin,
  Mail,
  MessageCircle,
} from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const sourceIcons = [MessageCircle, Mail, FileSpreadsheet, Instagram, KanbanSquare, Linkedin]

const signalTimings = [
  { begin: "0.2s", dur: "2.8s" },
  { begin: "1.4s", dur: "3.6s" },
  { begin: "0.7s", dur: "3.1s" },
  { begin: "2.1s", dur: "4.0s" },
  { begin: "1.0s", dur: "3.3s" },
  { begin: "2.6s", dur: "3.8s" },
]

type Connection = {
  id: string
  path: string
}

type MapSize = {
  width: number
  height: number
}

type HeroSystemMapProps = {
  sources: string[]
  systemLabel: string
  systemTitle: string
  bullets: string[]
  statusLabel: string
}

export function HeroSystemMap({
  sources,
  systemLabel,
  systemTitle,
  bullets,
  statusLabel,
}: HeroSystemMapProps) {
  const reduced = useReducedMotion()
  const mapRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const sourceRefs = useRef<(HTMLDivElement | null)[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [mapSize, setMapSize] = useState<MapSize>({ width: 0, height: 0 })

  const measure = useCallback(() => {
    const map = mapRef.current
    const target = targetRef.current
    if (!map || !target) return

    const width = map.clientWidth
    const height = map.clientHeight
    if (width === 0 || height === 0) return

    const mapBounds = map.getBoundingClientRect()
    const targetBounds = target.getBoundingClientRect()
    const scaleX = width / mapBounds.width
    const scaleY = height / mapBounds.height

    const nodes = sourceRefs.current
      .map((node, index) => ({ node, index }))
      .filter((entry): entry is { node: HTMLDivElement; index: number } => Boolean(entry.node))

    setMapSize({ width, height })
    setConnections(
      nodes.map(({ node, index }) => {
        const sourceBounds = node.getBoundingClientRect()
        // Anchor to the outer stroke of each card (right edge → left edge).
        const startX = (sourceBounds.right - mapBounds.left) * scaleX
        const startY = (sourceBounds.top - mapBounds.top + sourceBounds.height / 2) * scaleY
        const endX = (targetBounds.left - mapBounds.left) * scaleX
        const endY =
          (targetBounds.top - mapBounds.top + (targetBounds.height * (index + 1)) / (nodes.length + 1)) *
          scaleY
        const controlX = startX + (endX - startX) * 0.55

        return {
          id: `connection-${index}`,
          path: `M ${startX.toFixed(2)} ${startY.toFixed(2)} C ${controlX.toFixed(2)} ${startY.toFixed(2)}, ${controlX.toFixed(2)} ${endY.toFixed(2)}, ${endX.toFixed(2)} ${endY.toFixed(2)}`,
        }
      })
    )
  }, [])

  useLayoutEffect(() => {
    const map = mapRef.current
    const target = targetRef.current
    if (!map || !target) return

    measure()

    const observer = new ResizeObserver(() => measure())
    observer.observe(map)
    observer.observe(target)
    sourceRefs.current.forEach((source) => {
      if (source) observer.observe(source)
    })

    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [sources, measure])

  return (
    <div className="glass-card relative overflow-hidden p-5 sm:p-7">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_45%,rgba(59,130,246,0.14),transparent_36%)]"
        aria-hidden
      />
      <div className="relative mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/75">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(59,130,246,0.9)]"
          animate={reduced ? undefined : { opacity: [1, 0.4, 1], scale: [1, 1.35, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        {statusLabel}
      </div>

      <div
        ref={mapRef}
        className="relative grid min-h-[300px] grid-cols-[1fr_1.1fr] items-center gap-6 sm:min-h-[336px] sm:gap-10"
      >
        {mapSize.width > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 z-[15] hidden h-full w-full md:block"
            width={mapSize.width}
            height={mapSize.height}
            viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}
            fill="none"
            aria-hidden
          >
            <defs>
              <filter id="signal-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {connections.map((connection, index) => (
              <motion.path
                key={connection.id}
                d={connection.path}
                stroke="rgba(96,165,250,0.55)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}

            {!reduced &&
              connections.map((connection, index) => {
                const timing = signalTimings[index % signalTimings.length]
                return (
                  <circle
                    key={`${connection.id}-signal`}
                    r="3.25"
                    fill="#60a5fa"
                    filter="url(#signal-glow)"
                  >
                    <animateMotion
                      path={connection.path}
                      begin={timing.begin}
                      dur={timing.dur}
                      repeatCount="indefinite"
                    />
                  </circle>
                )
              })}
          </svg>
        )}

        <div className="relative z-10 grid grid-cols-1 gap-2.5">
          {sources.slice(0, sourceIcons.length).map((source, index) => {
            const Icon = sourceIcons[index]
            return (
              <div
                key={source}
                ref={(node) => {
                  sourceRefs.current[index] = node
                }}
                className="w-full"
              >
                <motion.div
                  className="flex w-full items-center gap-2.5 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-xs font-medium text-gray-300 shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12 + index * 0.05, duration: 0.35 }}
                >
                  <Icon className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                  <span className="truncate">{source}</span>
                </motion.div>
              </div>
            )
          })}
        </div>

        <div
          ref={targetRef}
          className="relative z-10 w-full rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/[0.18] to-blue-950/40 p-4 shadow-[0_0_42px_-18px_rgba(59,130,246,0.7)] sm:p-5"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.45 }}
          >
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-primary/80">
              {systemLabel}
            </p>
            <h3 className="mb-4 text-lg font-bold tracking-tight text-white sm:text-xl">
              {systemTitle}
            </h3>
            <ul className="space-y-2.5">
              {bullets.map((bullet, index) => (
                <motion.li
                  key={bullet}
                  className="flex gap-2 text-xs leading-snug text-blue-50/90"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.08, duration: 0.28 }}
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  {bullet}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
