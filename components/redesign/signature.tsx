/**
 * Multi-path signature placeholder.
 * Replace the paths below with Eze's real signature SVG when ready —
 * keep multiple <path> elements so the loader can stagger the draw.
 */
const PATHS = [
  // E
  "M72 148 C58 52 118 28 148 72 C162 96 132 118 108 96 C128 88 168 112 156 148",
  // V
  "M196 68 C210 68 218 72 228 148 C236 88 262 60 298 68 C318 74 328 108 318 148",
  // flourish
  "M340 118 C400 78 470 70 560 92 C500 108 430 142 360 138",
]

type SignatureProps = {
  className?: string
  /** When true, CSS draw animation is skipped (GSAP drives the paths). */
  static?: boolean
  "data-loader-sig"?: boolean
  "data-logo-sig"?: boolean
}

export function Signature({
  className = "",
  static: isStatic = false,
  ...dataAttrs
}: SignatureProps) {
  return (
    <svg
      viewBox="0 0 640 200"
      className={className}
      aria-hidden
      fill="none"
      {...(dataAttrs["data-loader-sig"] ? { "data-loader-sig": "" } : {})}
      {...(dataAttrs["data-logo-sig"] ? { "data-logo-sig": "" } : {})}
    >
      {PATHS.map((d, index) => (
        <path
          key={index}
          className={isStatic ? "sig-path-static" : "sig-path"}
          pathLength={1}
          d={d}
          style={isStatic ? undefined : { animationDelay: `${index * 0.28}s` }}
        />
      ))}
    </svg>
  )
}

export const SIGNATURE_PATH_COUNT = PATHS.length
