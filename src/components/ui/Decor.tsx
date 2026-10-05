// ─── LED strip divider ───────────────────────────────────────────────────────
//
// A WS2812B strip (60 LEDs/m): 5050 pixel + 100nF decoupling cap per segment,
// 5V/GND rails along the edges, DO→DI data hopping pixel to pixel, and cut
// pads between every pixel. Being addressable, a pixel "chases" down the
// strip in the direction data flows. Lit in Duke blue, naturally.

const STRIP_PIXELS = 72
const PITCH = 34        // px per segment
const STRIP_H = 30
const COPPER_DIM = 'rgba(216, 162, 74, 0.28)'
const PAD = '#d8a24a'
const GLOW_PAD = 22     // room above/below the strip for the glow to bleed into

function StripSegment({ i }: { i: number }) {
  const x0 = i * PITCH
  const cx = x0 + PITCH / 2
  const mid = STRIP_H / 2
  return (
    <g>
      {/* Cut line + solder pads (5V / D / GND) on either side */}
      <line x1={x0} y1={2} x2={x0} y2={STRIP_H - 2} stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" strokeDasharray="2 2" />
      {[4, mid, STRIP_H - 4].map(y => (
        <g key={y}>
          <rect x={x0 - 5} y={y - 2.5} width={3.5} height={5} rx={0.6} fill={PAD} />
          <rect x={x0 + 1.5} y={y - 2.5} width={3.5} height={5} rx={0.6} fill={PAD} />
        </g>
      ))}
      {/* Data in → pixel → data out */}
      <line x1={x0 + 5} y1={mid} x2={cx - 7.5} y2={mid} stroke={COPPER_DIM} strokeWidth="1.2" />
      <line x1={cx + 7.5} y1={mid} x2={x0 + PITCH - 5} y2={mid} stroke={COPPER_DIM} strokeWidth="1.2" />
      <path d={`M${x0 + 8} ${mid - 6.5} l3 2 -3 2 z`} fill="rgba(255,255,255,0.4)" />
      {/* 0402 decoupling cap between the rails */}
      <rect x={cx + 9.5} y={mid - 4} width={3} height={8} rx={0.5} fill="#b8875a" />
      {/* 5050 package with its diffuser */}
      <rect x={cx - 7.5} y={mid - 7.5} width={15} height={15} rx={1.6} fill="#eceef3" />
      <circle cx={cx} cy={mid} r={5.4} fill="#c3c7d1" />
      <path d={`M${cx - 7.5} ${mid - 4.5} l3 -3`} stroke="#9aa0ad" strokeWidth="0.8" />
      {/* The lit pixel (animated) */}
      <g className={`ws-pixel ${i % 6 === 0 ? 'ws-static' : ''}`} style={{ animationDelay: `${(i * 0.06 - 6).toFixed(2)}s` }}>
        <circle cx={cx} cy={mid} r={22} fill="url(#ws-glow)" />
        <rect x={cx - 7.5} y={mid - 7.5} width={15} height={15} rx={1.6} fill="#3d8bff" />
        <circle cx={cx} cy={mid} r={5.4} fill="url(#ws-core)" />
      </g>
    </g>
  )
}

/** A WS2812B LED strip running off both edges of the screen. */
export function LedStripDivider({ className = '' }: { className?: string }) {
  const width = STRIP_PIXELS * PITCH
  return (
    <div className={`relative w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox={`0 0 ${width} ${STRIP_H + GLOW_PAD * 2}`}
        width={width}
        height={STRIP_H + GLOW_PAD * 2}
        className="relative left-1/2 -translate-x-1/2 max-w-none"
      >
        <defs>
          <radialGradient id="ws-glow">
            <stop offset="0%" stopColor="#7cc4ff" stopOpacity="1" />
            <stop offset="35%" stopColor="#2b7fff" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#00539b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00539b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ws-core">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#d6ecff" />
            <stop offset="100%" stopColor="#7cc4ff" />
          </radialGradient>
        </defs>
        <g transform={`translate(0 ${GLOW_PAD})`}>
          {/* Black flex PCB with the 5V and GND rails under the mask */}
          <rect x={0} y={0} width={width} height={STRIP_H} fill="#0b0d12" />
          <rect x={0} y={0} width={width} height={1} fill="rgba(255,255,255,0.08)" />
          <line x1={0} y1={4} x2={width} y2={4} stroke={COPPER_DIM} strokeWidth="2" />
          <line x1={0} y1={STRIP_H - 4} x2={width} y2={STRIP_H - 4} stroke={COPPER_DIM} strokeWidth="2" />
          {Array.from({ length: STRIP_PIXELS }, (_, i) => <StripSegment key={i} i={i} />)}
        </g>
      </svg>
    </div>
  )
}

// ─── Binary divider ──────────────────────────────────────────────────────────

const BINARY = 'hello, world'
  .split('')
  .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
  .join(' ')

/** A faded line of ones and zeros. (It says something, if you decode it.) */
export function BinaryDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`binary-line max-w-6xl mx-auto px-6 overflow-hidden ${className}`} aria-hidden="true">
      <p className="font-mono text-xs tracking-[0.3em] whitespace-nowrap text-center text-sky/45 select-none">
        {BINARY}
      </p>
    </div>
  )
}

// ─── Sticker ─────────────────────────────────────────────────────────────────

const STICKER_TONES = {
  lime:     'bg-lime text-night',
  rosa:     'bg-rosa text-night',
  marigold: 'bg-marigold text-night',
  turquesa: 'bg-turquesa text-night',
  duke:     'bg-duke text-cream',
  cream:    'bg-cream text-night',
}

interface StickerProps {
  children: React.ReactNode
  tone?: keyof typeof STICKER_TONES
  tilt?: 'left' | 'right'
  wiggle?: boolean
  className?: string
}

/** A rotated pill that looks slapped onto the page. Straightens on hover. */
export function Sticker({ children, tone = 'lime', tilt = 'left', wiggle = false, className = '' }: StickerProps) {
  return (
    <span className={`sticker sticker-tilt-${tilt} ${STICKER_TONES[tone]} ${wiggle ? 'animate-wiggle' : ''} ${className}`}>
      {children}
    </span>
  )
}

// ─── Arrow ───────────────────────────────────────────────────────────────────

export function ArrowIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
