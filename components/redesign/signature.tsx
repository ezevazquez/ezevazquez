type SignatureProps = {
  className?: string
  static?: boolean
  "data-loader-sig"?: boolean
  "data-logo-sig"?: boolean
}

const STROKES = [
  "M46 118 C62 46 118 34 136 78 C146 104 104 118 86 92 C112 86 158 104 142 146",
  "M168 104 C214 62 268 58 286 102 C298 132 248 142 262 104 C292 78 332 92 318 128",
  "M338 118 C372 74 452 72 468 116 C478 146 408 162 386 132 C372 114 412 104 446 118",
  "M72 156 C190 188 360 176 548 128",
]

export function Signature({
  className = "",
  static: isStatic = false,
  ...dataAttrs
}: SignatureProps) {
  return (
    <svg
      viewBox="0 0 600 210"
      className={className}
      role="img"
      aria-label="Eze"
      fill="none"
      {...(dataAttrs["data-loader-sig"] ? { "data-loader-sig": "" } : {})}
      {...(dataAttrs["data-logo-sig"] ? { "data-logo-sig": "" } : {})}
    >
      {STROKES.map((d, index) => (
        <path
          key={index}
          d={d}
          pathLength={1}
          className={isStatic ? "sig-path-static" : "sig-path"}
          style={isStatic ? undefined : { animationDelay: `${index * 0.32}s` }}
        />
      ))}
    </svg>
  )
}

export const SIGNATURE_PATH_COUNT = STROKES.length
