export function Signature({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 200" className={className} aria-hidden fill="none">
      <path
        className="sig-path"
        pathLength={1}
        d="M48 130
           C70 40 130 28 150 78
           C162 108 120 128 108 96
           C132 88 176 110 168 150
           C210 78 250 70 268 108
           C286 146 236 156 250 112
           C300 70 360 64 392 108
           C410 132 370 158 348 132
           C338 118 366 108 400 118
           C470 136 530 120 590 96"
      />
    </svg>
  )
}
