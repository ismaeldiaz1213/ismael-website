import { useEffect, useRef } from 'react'

/**
 * A little PCB that routes itself.
 *
 * Each round: parts pop onto the board, a handful of "pipes" route neon traces
 * pad-to-pad with 45° bends, pads and LEDs light up as traces land, the
 * finished board holds for a moment, then everything fades and a brand new
 * board is generated (as if you had refreshed the page).
 */

// ─── Tuning ──────────────────────────────────────────────────────────────────

const PIPE_COUNT     = 5       // traces being routed at the same time
const HOPS_PER_PIPE  = 4       // connections each pipe lays per round
const SPEED          = 180     // px per second
const STUB           = 16      // straight run out of a pad before the first bend
const PIPE_STAGGER   = 450     // ms between pipe starts
const POP_IN_MS      = 550
const HOLD_MS        = 7000    // finished board stays lit this long
const ROUND_MAX_MS   = 32000   // safety cap on a single round
const FADE_OUT_MS    = 800
const VIA_CHANCE     = 0.3     // chance a bend gets a via

const NEON       = '#c8ff3d'
const NEON_GLOW  = 'rgba(200, 255, 61, 0.9)'
const COPPER     = '#d8a24a'
const BODY       = '#0a1024'
const BODY_EDGE  = 'rgba(124, 196, 255, 0.4)'
const SILK       = 'rgba(255, 246, 233, 0.55)'
const LED_COLORS = ['#ff4f9a', '#ffb020', '#2ee6d6']
const CHIP_MARKS = ['BLUE-DVL', 'H-TOWN', 'SALSA-8']
const MONO       = '"iA Writer Mono", ui-monospace, monospace'
// Under-the-solder-mask details (dim, drawn once per round)
const MASK_COPPER = 'rgba(140, 190, 255, 0.13)'
const SILK_LINE   = 'rgba(255, 246, 233, 0.28)'
const HOLE        = '#04102e'

// ─── Types ───────────────────────────────────────────────────────────────────

type Kind = 'qfp' | 'soic' | 'sot23' | 'resistor' | 'capacitor' | 'crystal' | 'led'
type Vec  = { x: number; y: number }
type Rect = { x: number; y: number; hw: number; hh: number } // center + half extents

type Pad = {
  lx: number; ly: number; lw: number; lh: number // local center + size
  x: number; y: number; nx: number; ny: number  // world center + outward normal
  used: boolean; lit: boolean
}

type Part = {
  kind: Kind
  x: number; y: number; rot: number; s: number
  bw: number; bh: number   // local body size
  hw: number; hh: number   // world half extents including pads
  pads: Pad[]
  ref: string; mark?: string; ledColor?: string
  bornAt: number; litAt: number
}

type Pipe = {
  at: number                 // index of the part the pipe is sitting on
  path: Vec[]; seg: number; segPos: number
  head: Vec
  dest: { part: number; pad: Pad } | null
  hops: number; startAt: number; started: boolean; done: boolean
}

type Phase = 'build' | 'hold' | 'fade'

// ─── Geometry helpers ────────────────────────────────────────────────────────

const rand  = (a: number, b: number) => a + Math.random() * (b - a)
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const dist  = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y)
const inRect = (p: Vec, r: Rect, pad = 0) =>
  Math.abs(p.x - r.x) < r.hw + pad && Math.abs(p.y - r.y) < r.hh + pad
const rectsOverlap = (a: Rect, b: Rect, gap: number) =>
  Math.abs(a.x - b.x) < a.hw + b.hw + gap && Math.abs(a.y - b.y) < a.hh + b.hh + gap
const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2)

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ─── Part factory ────────────────────────────────────────────────────────────

type LocalPad = { lx: number; ly: number; lw: number; lh: number; nx: number; ny: number }

/** A row of n pads along one side of a body. */
function padRow(n: number, pitch: number, side: 'top' | 'bottom' | 'left' | 'right',
                bw: number, bh: number, long: number, short: number): LocalPad[] {
  const out: LocalPad[] = []
  for (let i = 0; i < n; i++) {
    const t = (i - (n - 1) / 2) * pitch
    if (side === 'top')    out.push({ lx: t, ly: -bh / 2 - long / 2 - 1, lw: short, lh: long, nx: 0, ny: -1 })
    if (side === 'bottom') out.push({ lx: t, ly:  bh / 2 + long / 2 + 1, lw: short, lh: long, nx: 0, ny:  1 })
    if (side === 'left')   out.push({ lx: -bw / 2 - long / 2 - 1, ly: t, lw: long, lh: short, nx: -1, ny: 0 })
    if (side === 'right')  out.push({ lx:  bw / 2 + long / 2 + 1, ly: t, lw: long, lh: short, nx:  1, ny: 0 })
  }
  return out
}

/** Two pads at either end of a small two-terminal body. */
const endPads = (bw: number, pw: number, ph: number): LocalPad[] => [
  { lx: -bw / 2 - pw / 2 - 1, ly: 0, lw: pw, lh: ph, nx: -1, ny: 0 },
  { lx:  bw / 2 + pw / 2 + 1, ly: 0, lw: pw, lh: ph, nx:  1, ny: 0 },
]

function footprint(kind: Kind): { bw: number; bh: number; pads: LocalPad[] } {
  switch (kind) {
    case 'qfp': {
      const bw = 84, bh = 84
      return { bw, bh, pads: (['top', 'bottom', 'left', 'right'] as const)
        .flatMap(side => padRow(7, 10, side, bw, bh, 13, 5)) }
    }
    case 'soic': {
      const bw = 72, bh = 34
      return { bw, bh, pads: [...padRow(6, 11, 'top', bw, bh, 12, 6), ...padRow(6, 11, 'bottom', bw, bh, 12, 6)] }
    }
    case 'sot23': {
      const bw = 24, bh = 16
      return { bw, bh, pads: [
        { lx: -8, ly:  bh / 2 + 5, lw: 7, lh: 8, nx: 0, ny:  1 },
        { lx:  8, ly:  bh / 2 + 5, lw: 7, lh: 8, nx: 0, ny:  1 },
        { lx:  0, ly: -bh / 2 - 5, lw: 7, lh: 8, nx: 0, ny: -1 },
      ] }
    }
    case 'resistor':
    case 'capacitor': return { bw: 30, bh: 14, pads: endPads(30, 12, 16) }
    case 'crystal':   return { bw: 50, bh: 20, pads: endPads(50, 12, 14) }
    case 'led':       return { bw: 26, bh: 14, pads: endPads(26, 10, 14) }
  }
}

function makePart(kind: Kind, x: number, y: number, rot: number, s: number, ref: string): Part {
  const fp = footprint(kind)
  const c = Math.round(Math.cos(rot)), sn = Math.round(Math.sin(rot))
  let ex = fp.bw / 2, ey = fp.bh / 2
  const pads: Pad[] = fp.pads.map(p => {
    const lx = p.lx * s, ly = p.ly * s, lw = p.lw * s, lh = p.lh * s
    ex = Math.max(ex, (Math.abs(p.lx) + p.lw / 2))
    ey = Math.max(ey, (Math.abs(p.ly) + p.lh / 2))
    return {
      lx, ly, lw, lh,
      x: x + lx * c - ly * sn, y: y + lx * sn + ly * c,
      nx: p.nx * c - p.ny * sn, ny: p.nx * sn + p.ny * c,
      used: false, lit: false,
    }
  })
  const swap = sn !== 0
  return {
    kind, x, y, rot, s,
    bw: fp.bw * s, bh: fp.bh * s,
    hw: (swap ? ey : ex) * s, hh: (swap ? ex : ey) * s,
    pads, ref, bornAt: 0, litAt: 0,
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PCBTraceAnimation({ className = '' }: { className?: string }) {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext('2d')!
    // Traces live on their own canvas so they persist for the whole round
    const traceCanvas = document.createElement('canvas')
    const tctx = traceCanvas.getContext('2d')!
    // Static board art (copper under the mask, holes, silkscreen) for this round
    const boardCanvas = document.createElement('canvas')
    const bctx = boardCanvas.getContext('2d')!
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0, h = 0, dpr = 1, scale = 1
    let parts: Part[] = []
    let pipes: Pipe[] = []
    let linked = new Set<string>()
    let keepOuts: Rect[] = []
    let phase: Phase = 'build'
    let phaseAt = 0, roundStart = 0
    let raf = 0, last = 0
    let visible = true

    const linkKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`)
    const partRect = (p: Part): Rect => ({ x: p.x, y: p.y, hw: p.hw, hh: p.hh })

    // ── Layout ──────────────────────────────────────────────────────────

    function layoutBoard(now: number) {
      scale = clamp(Math.min(w, h * 1.6) / 1000, 0.7, 1.35)
      const mobile = w < 640

      // Keep parts out from under the headline and the bottom CTA row
      keepOuts = [
        { x: w / 2, y: h * 0.45, hw: Math.min(w * 0.42, 440), hh: Math.min(h * 0.23, 180) },
        { x: w / 2, y: h, hw: w / 2, hh: mobile ? 230 : 130 },
        // Mounting holes + board labels in the top corners
        { x: 0, y: 0, hw: mobile ? 70 : 250, hh: 60 },
        { x: w, y: 0, hw: mobile ? 70 : 250, hh: 60 },
      ]

      const target = clamp(Math.round((w * h) / 75000), 5, 13)
      const pool = shuffle<Kind>(['soic', 'crystal', 'led', 'led', 'resistor', 'capacitor',
        'sot23', 'soic', 'led', 'resistor', 'capacitor', 'sot23'])
      const kinds = (['qfp', ...pool] as Kind[]).slice(0, target)
      const refCount: Record<string, number> = {}
      const prefix: Record<Kind, string> = { qfp: 'U', soic: 'U', sot23: 'Q', resistor: 'R', capacitor: 'C', crystal: 'Y', led: 'D' }
      const edge = 20, gap = 46 * scale
      let markIdx = 0

      parts = []
      for (const kind of kinds) {
        for (let attempt = 0; attempt < 120; attempt++) {
          const rot = kind === 'qfp' || Math.random() < 0.5 ? 0 : Math.PI / 2
          const probe = makePart(kind, 0, 0, rot, scale, '')
          const x = rand(edge + probe.hw, w - edge - probe.hw)
          const y = rand(edge + probe.hh + 14, h - edge - probe.hh)
          const r: Rect = { x, y, hw: probe.hw, hh: probe.hh }
          if (keepOuts.some(k => rectsOverlap(r, k, 6))) continue
          if (parts.some(p => rectsOverlap(r, partRect(p), gap))) continue

          const p = prefix[kind]
          refCount[p] = (refCount[p] ?? 0) + 1
          const part = makePart(kind, x, y, rot, scale, `${p}${refCount[p]}`)
          part.bornAt = now + parts.length * 70
          if (kind === 'qfp') part.mark = 'DIAZ-01'
          if (kind === 'soic') part.mark = CHIP_MARKS[markIdx++ % CHIP_MARKS.length]
          if (kind === 'led') part.ledColor = LED_COLORS[Math.floor(Math.random() * LED_COLORS.length)]
          parts.push(part)
          break
        }
      }
    }

    // ── Routing ─────────────────────────────────────────────────────────

    function freePads(p: Part) { return p.pads.filter(pad => !pad.used) }

    /** Free pad on `part` whose stub end lands closest to `toward`. */
    function choosePad(part: Part, toward: Vec): Pad | null {
      let best: Pad | null = null, bestScore = Infinity
      for (const pad of freePads(part)) {
        const stub = { x: pad.x + pad.nx * STUB * scale, y: pad.y + pad.ny * STUB * scale }
        const score = dist(stub, toward) + Math.random() * 8
        if (score < bestScore) { bestScore = score; best = pad }
      }
      return best
    }

    /** Bend point for a 0°/45° route from a to b. */
    function bend(a: Vec, b: Vec, diagonalFirst: boolean): Vec {
      const dx = b.x - a.x, dy = b.y - a.y
      const ax = Math.abs(dx), ay = Math.abs(dy), sx = Math.sign(dx), sy = Math.sign(dy)
      if (diagonalFirst) {
        const d = Math.min(ax, ay)
        return { x: a.x + sx * d, y: a.y + sy * d }
      }
      return ax > ay ? { x: a.x + sx * (ax - ay), y: a.y } : { x: a.x, y: a.y + sy * (ay - ax) }
    }

    /** How much a polyline runs over other parts (and, less so, the headline). */
    function routeCost(path: Vec[], skip: Set<number>): number {
      let cost = 0
      for (let i = 0; i < path.length - 1; i++) {
        const n = Math.max(1, Math.ceil(dist(path[i], path[i + 1]) / 8))
        for (let k = 0; k <= n; k++) {
          const t = k / n
          const pt = { x: path[i].x + (path[i + 1].x - path[i].x) * t, y: path[i].y + (path[i + 1].y - path[i].y) * t }
          parts.forEach((p, idx) => { if (!skip.has(idx) && inRect(pt, partRect(p), 6)) cost += 1 })
          if (inRect(pt, keepOuts[0])) cost += 0.25
        }
      }
      return cost
    }

    function route(src: Pad, dst: Pad, skip: Set<number>): Vec[] {
      const stub = STUB * scale
      const p0 = { x: src.x, y: src.y }
      const p1 = { x: src.x + src.nx * stub, y: src.y + src.ny * stub }
      const p3 = { x: dst.x + dst.nx * stub, y: dst.y + dst.ny * stub }
      const p4 = { x: dst.x, y: dst.y }
      const options = [true, false].map(diag => [p0, p1, bend(p1, p3, diag), p3, p4])
      const costs = options.map(o => routeCost(o, skip) + Math.random() * 0.5)
      const chosen = costs[0] <= costs[1] ? options[0] : options[1]
      return chosen.filter((pt, i) => i === 0 || dist(pt, chosen[i - 1]) > 0.5)
    }

    /** Pick the next part for a pipe to connect to and lay out the trace. */
    function plan(pipe: Pipe) {
      const from = parts[pipe.at]
      if (!from || freePads(from).length === 0) { pipe.done = true; return }

      let bestIdx = -1, bestScore = Infinity
      parts.forEach((p, i) => {
        if (i === pipe.at || freePads(p).length === 0 || linked.has(linkKey(pipe.at, i))) return
        const score = dist(from, p) * rand(0.8, 1.4)
        if (score < bestScore) { bestScore = score; bestIdx = i }
      })
      if (bestIdx < 0) { pipe.done = true; return }

      const to = parts[bestIdx]
      const sp = choosePad(from, to)!
      sp.used = true
      const dp = choosePad(to, sp)
      if (!dp) { pipe.done = true; return }
      dp.used = true
      sp.lit = true
      linked.add(linkKey(pipe.at, bestIdx))

      pipe.path = route(sp, dp, new Set([pipe.at, bestIdx]))
      pipe.seg = 0
      pipe.segPos = 0
      pipe.head = { ...pipe.path[0] }
      pipe.dest = { part: bestIdx, pad: dp }
    }

    function arrive(pipe: Pipe, now: number) {
      if (!pipe.dest) { pipe.done = true; return }
      pipe.dest.pad.lit = true
      parts[pipe.dest.part].litAt = now
      pipe.at = pipe.dest.part
      pipe.dest = null
      pipe.hops++
      if (pipe.hops >= HOPS_PER_PIPE) pipe.done = true
      else plan(pipe)
    }

    // ── Drawing: board art (static per round) ──────────────────────────

    /** A group of parallel copper traces running edge to edge under the mask. */
    function drawBus() {
      const horizontal = Math.random() < 0.6
      const lanes = 2 + Math.floor(Math.random() * 3)
      const pitch = 9 * scale
      for (let attempt = 0; attempt < 14; attempt++) {
        let path: Vec[]
        if (horizontal) {
          const y0 = rand(h * 0.1, h * 0.9), y1 = clamp(y0 + rand(-h * 0.3, h * 0.3), 30, h - 30)
          const d = Math.abs(y1 - y0)
          const ax = rand(w * 0.15, Math.max(w * 0.15, w * 0.85 - d))
          path = [{ x: -10, y: y0 }, { x: ax, y: y0 }, { x: ax + d, y: y1 }, { x: w + 10, y: y1 }]
        } else {
          const x0 = rand(w * 0.08, w * 0.92), x1 = clamp(x0 + rand(-w * 0.2, w * 0.2), 30, w - 30)
          const d = Math.abs(x1 - x0)
          const ay = rand(h * 0.15, Math.max(h * 0.15, h * 0.85 - d))
          path = [{ x: x0, y: -10 }, { x: x0, y: ay }, { x: x1, y: ay + d }, { x: x1, y: h + 10 }]
        }
        const lanesPaths = Array.from({ length: lanes }, (_, k) =>
          path.map(pt => horizontal ? { x: pt.x, y: pt.y + k * pitch } : { x: pt.x + k * pitch, y: pt.y }))
        if (lanesPaths.some(lp => routeCost(lp, new Set()) > 0)) continue

        bctx.save()
        bctx.strokeStyle = MASK_COPPER
        bctx.lineWidth = 2.4 * scale
        bctx.lineJoin = 'round'
        for (const lp of lanesPaths) {
          bctx.beginPath()
          lp.forEach((pt, i) => (i ? bctx.lineTo(pt.x, pt.y) : bctx.moveTo(pt.x, pt.y)))
          bctx.stroke()
        }
        bctx.restore()
        return
      }
    }

    function drawRing(x: number, y: number, r: number, hole: number, color: string) {
      bctx.fillStyle = color
      bctx.beginPath(); bctx.arc(x, y, r, 0, Math.PI * 2); bctx.fill()
      bctx.fillStyle = HOLE
      bctx.beginPath(); bctx.arc(x, y, hole, 0, Math.PI * 2); bctx.fill()
    }

    function drawBoardArt() {
      bctx.setTransform(1, 0, 0, 1, 0, 0)
      bctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height)
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Copper buses under the mask
      const buses = clamp(Math.round((w * h) / 220000), 2, 6)
      for (let i = 0; i < buses; i++) drawBus()

      // Stitching via clusters in empty spots
      for (let c = 0, tries = 0; c < 4 && tries < 60; tries++) {
        const cx = rand(40, w - 40), cy = rand(40, h - 40)
        const cluster: Rect = { x: cx, y: cy, hw: 24, hh: 14 }
        if (parts.some(p => rectsOverlap(cluster, partRect(p), 10)) || keepOuts.some(k => rectsOverlap(cluster, k, 0))) continue
        for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++)
          drawRing(cx - 21 + i * 14, cy - 7 + j * 14, 3.4, 1.6, 'rgba(216, 162, 74, 0.35)')
        c++
      }

      // Mounting holes + silkscreen in the top corners
      const inset = 30
      for (const x of [inset, w - inset]) {
        drawRing(x, inset, 12, 7, 'rgba(216, 162, 74, 0.75)')
        bctx.strokeStyle = SILK_LINE
        bctx.lineWidth = 1
        bctx.beginPath(); bctx.arc(x, inset, 17, 0, Math.PI * 2); bctx.stroke()
      }
      if (w >= 640) {
        bctx.fillStyle = SILK
        bctx.font = `600 11px ${MONO}`
        bctx.textBaseline = 'middle'
        bctx.textAlign = 'left'
        bctx.fillText('DIAZZISM-MAIN  REV 2.0', inset + 28, inset - 6)
        bctx.font = `10px ${MONO}`
        bctx.fillStyle = 'rgba(255, 246, 233, 0.35)'
        bctx.fillText('4-LAYER · 1.6MM · ENIG', inset + 28, inset + 9)
        bctx.textAlign = 'right'
        bctx.fillStyle = SILK
        bctx.font = `600 11px ${MONO}`
        bctx.fillText('FAB: DUKE  ·  ASSY: HOUSTON, TX', w - inset - 28, inset - 6)
        // Fiducial
        const fx = w - inset - 40, fy = inset + 12
        bctx.fillStyle = 'rgba(216, 162, 74, 0.8)'
        bctx.beginPath(); bctx.arc(fx, fy, 3, 0, Math.PI * 2); bctx.fill()
        bctx.strokeStyle = 'rgba(255, 246, 233, 0.2)'
        bctx.beginPath(); bctx.arc(fx, fy, 7, 0, Math.PI * 2); bctx.stroke()
      }
    }

    // ── Drawing: traces (persistent) ────────────────────────────────────

    function strokeTrace(a: Vec, b: Vec) {
      tctx.save()
      tctx.strokeStyle = NEON
      tctx.lineWidth = Math.max(2, 3.2 * scale)
      tctx.lineCap = 'round'
      tctx.shadowColor = NEON_GLOW
      tctx.shadowBlur = 10
      tctx.beginPath()
      tctx.moveTo(a.x, a.y)
      tctx.lineTo(b.x, b.y)
      tctx.stroke()
      tctx.restore()
    }

    function drawVia(p: Vec) {
      const r = 5.5 * scale
      tctx.save()
      tctx.fillStyle = NEON
      tctx.shadowColor = NEON_GLOW
      tctx.shadowBlur = 12
      tctx.beginPath(); tctx.arc(p.x, p.y, r, 0, Math.PI * 2); tctx.fill()
      tctx.shadowBlur = 0
      tctx.fillStyle = '#050a1c'
      tctx.beginPath(); tctx.arc(p.x, p.y, r * 0.45, 0, Math.PI * 2); tctx.fill()
      tctx.restore()
    }

    function step(pipe: Pipe, dt: number, now: number) {
      let budget = SPEED * dt
      while (budget > 0 && !pipe.done) {
        const a = pipe.path[pipe.seg], b = pipe.path[pipe.seg + 1]
        if (!b) { arrive(pipe, now); continue }
        const len = dist(a, b)
        const move = Math.min(len - pipe.segPos, budget)
        const prev = pipe.head
        pipe.segPos += move
        budget -= move
        const t = len === 0 ? 1 : pipe.segPos / len
        pipe.head = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
        strokeTrace(prev, pipe.head)
        if (pipe.segPos >= len - 1e-6) {
          pipe.seg++
          pipe.segPos = 0
          // Interior bends only (not the pad stubs)
          if (pipe.seg >= 2 && pipe.seg <= pipe.path.length - 3 && Math.random() < VIA_CHANCE) drawVia(b)
        }
      }
    }

    // ── Drawing: parts (redrawn every frame on top of the traces) ───────

    function drawPart(p: Part, now: number) {
      const t = clamp((now - p.bornAt) / POP_IN_MS, 0, 1)
      if (t <= 0) return
      const pop = easeOutBack(t)
      const { s, bw, bh } = p

      ctx.save()
      ctx.globalAlpha *= t
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.scale(pop, pop)

      // Pads
      for (const pad of p.pads) {
        ctx.shadowBlur = pad.lit ? 10 : 0
        ctx.shadowColor = NEON_GLOW
        ctx.fillStyle = pad.lit ? NEON : COPPER
        ctx.fillRect(pad.lx - pad.lw / 2, pad.ly - pad.lh / 2, pad.lw, pad.lh)
      }
      ctx.shadowBlur = 0

      // Body
      const r = Math.min(bw, bh) * 0.12
      ctx.lineWidth = 1
      ctx.strokeStyle = BODY_EDGE
      ctx.fillStyle = BODY
      if (p.kind === 'capacitor') ctx.fillStyle = '#b8875a'
      if (p.kind === 'resistor')  ctx.fillStyle = '#111522'
      if (p.kind === 'crystal')   ctx.fillStyle = '#c5ccd8'
      if (p.kind === 'led')       ctx.fillStyle = '#e8ecf4'
      ctx.beginPath()
      ctx.roundRect(-bw / 2, -bh / 2, bw, bh, p.kind === 'crystal' ? bh / 2 : r)
      ctx.fill()
      if (p.kind !== 'crystal' && p.kind !== 'led' && p.kind !== 'capacitor') ctx.stroke()

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (p.kind === 'qfp' || p.kind === 'soic' || p.kind === 'sot23') {
        // Pin-1 dot
        ctx.fillStyle = 'rgba(255,255,255,0.35)'
        ctx.beginPath()
        ctx.arc(-bw / 2 + 7 * s, -bh / 2 + 7 * s, 2.4 * s, 0, Math.PI * 2)
        ctx.fill()
      }
      if (p.mark) {
        ctx.fillStyle = 'rgba(255,246,233,0.75)'
        ctx.font = `600 ${(p.kind === 'qfp' ? 11 : 9) * s}px ${MONO}`
        ctx.fillText(p.mark, 0, p.kind === 'qfp' ? -6 * s : 0)
        if (p.kind === 'qfp') {
          ctx.fillStyle = 'rgba(255,246,233,0.4)'
          ctx.font = `${7.5 * s}px ${MONO}`
          ctx.fillText('HECHO EN TX', 0, 9 * s)
        }
      }
      if (p.kind === 'resistor') {
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.font = `${8 * s}px ${MONO}`
        ctx.fillText('103', 0, 0)
      }
      if (p.kind === 'crystal') {
        ctx.strokeStyle = 'rgba(10,16,36,0.35)'
        ctx.beginPath()
        ctx.roundRect(-bw / 2 + 4 * s, -bh / 2 + 4 * s, bw - 8 * s, bh - 8 * s, (bh - 8 * s) / 2)
        ctx.stroke()
      }
      if (p.kind === 'led') {
        const lit = p.litAt > 0
        ctx.fillStyle = lit ? p.ledColor! : 'rgba(10,16,36,0.25)'
        ctx.shadowColor = p.ledColor!
        ctx.shadowBlur = lit ? 18 : 0
        ctx.beginPath()
        ctx.arc(0, 0, 4.5 * s, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
      ctx.restore()

      // LED bloom
      if (p.kind === 'led' && p.litAt > 0) {
        const k = clamp((now - p.litAt) / 300, 0, 1)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 46 * s)
        g.addColorStop(0, `${p.ledColor}66`)
        g.addColorStop(1, `${p.ledColor}00`)
        ctx.save()
        ctx.globalAlpha *= k * t
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = g
        ctx.fillRect(p.x - 46 * s, p.y - 46 * s, 92 * s, 92 * s)
        ctx.restore()
      }

      // Silkscreen corner brackets around the footprint
      {
        const m = 5 * s, L = Math.min(10 * s, p.hw, p.hh)
        const x0 = p.x - p.hw - m, x1 = p.x + p.hw + m, y0 = p.y - p.hh - m, y1 = p.y + p.hh + m
        ctx.save()
        ctx.globalAlpha *= t
        ctx.strokeStyle = SILK_LINE
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(x0, y0 + L); ctx.lineTo(x0, y0); ctx.lineTo(x0 + L, y0)
        ctx.moveTo(x1 - L, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + L)
        ctx.moveTo(x1, y1 - L); ctx.lineTo(x1, y1); ctx.lineTo(x1 - L, y1)
        ctx.moveTo(x0 + L, y1); ctx.lineTo(x0, y1); ctx.lineTo(x0, y1 - L)
        ctx.stroke()
        ctx.restore()
      }

      // Designator (always upright)
      ctx.save()
      ctx.globalAlpha *= t
      ctx.fillStyle = SILK
      ctx.font = `${9 * s}px ${MONO}`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.fillText(p.ref, p.x - p.hw - 5 * s, p.y - p.hh - 8 * s)
      ctx.restore()
    }

    function render(now: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = phase === 'fade' ? clamp(1 - (now - phaseAt) / FADE_OUT_MS, 0, 1) : 1

      ctx.drawImage(boardCanvas, 0, 0, w, h)
      ctx.drawImage(traceCanvas, 0, 0, w, h)
      for (const p of parts) drawPart(p, now)

      // Glowing heads on the traces currently being drawn
      for (const pipe of pipes) {
        if (!pipe.started || pipe.done) continue
        ctx.save()
        ctx.fillStyle = '#f4ffd6'
        ctx.shadowColor = NEON
        ctx.shadowBlur = 18
        ctx.beginPath()
        ctx.arc(pipe.head.x, pipe.head.y, Math.max(3, 4.5 * scale), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      ctx.globalAlpha = 1
    }

    // ── Round lifecycle ─────────────────────────────────────────────────

    function resetBoard(now: number) {
      tctx.setTransform(1, 0, 0, 1, 0, 0)
      tctx.clearRect(0, 0, traceCanvas.width, traceCanvas.height)
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      linked = new Set()
      layoutBoard(now)
      drawBoardArt()

      // First pipe always starts at the big chip; the rest pick random parts
      const starts = [0, ...shuffle(parts.map((_, i) => i).slice(1))]
      const popDone = now + parts.length * 70 + POP_IN_MS * 0.6
      pipes = Array.from({ length: Math.min(PIPE_COUNT, parts.length) }, (_, i) => ({
        at: starts[i % starts.length],
        path: [], seg: 0, segPos: 0, head: { x: 0, y: 0 }, dest: null,
        hops: 0, startAt: popDone + i * PIPE_STAGGER, started: false, done: false,
      }))

      phase = 'build'
      phaseAt = now
      roundStart = now
    }

    function tick(now: number, dt: number) {
      if (phase === 'build') {
        for (const pipe of pipes) {
          if (!pipe.started && now >= pipe.startAt) { pipe.started = true; plan(pipe) }
          if (pipe.started && !pipe.done) step(pipe, dt, now)
        }
        if (pipes.every(p => p.done) || now - roundStart > ROUND_MAX_MS) {
          phase = 'hold'; phaseAt = now
        }
      } else if (phase === 'hold' && now - phaseAt > HOLD_MS) {
        phase = 'fade'; phaseAt = now
      } else if (phase === 'fade' && now - phaseAt > FADE_OUT_MS) {
        resetBoard(now)
      }
    }

    /** Reduced motion: route the whole board instantly and show it static. */
    function renderStatic() {
      const now = performance.now()
      resetBoard(now)
      for (const p of parts) p.bornAt = -Infinity
      for (const pipe of pipes) { pipe.started = true; plan(pipe) }
      for (let i = 0; i < 5000 && pipes.some(p => !p.done); i++) {
        for (const pipe of pipes) if (!pipe.done) step(pipe, 0.1, now)
      }
      for (const p of parts) if (p.litAt > 0) p.litAt = -Infinity
      phase = 'hold'
      render(now)
    }

    // ── Sizing / visibility / loop ─────────────────────────────────────

    function resize() {
      const rect = wrap!.getBoundingClientRect()
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      dpr = Math.min(2, window.devicePixelRatio || 1)
      for (const c of [canvas!, traceCanvas, boardCanvas]) {
        c.width = Math.round(w * dpr)
        c.height = Math.round(h * dpr)
      }
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible) return
      tick(now, dt)
      render(now)
    }

    function start() {
      cancelAnimationFrame(raf)
      resize()
      if (reduceMotion) { renderStatic(); return }
      last = performance.now()
      resetBoard(last)
      raf = requestAnimationFrame(frame)
    }

    let resizeTimer = 0
    let lastSize = ''
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      const size = `${Math.round(width)}x${Math.round(height)}`
      if (size === lastSize) return
      const first = lastSize === ''
      lastSize = size
      window.clearTimeout(resizeTimer)
      if (first) start()
      else resizeTimer = window.setTimeout(start, 150)
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(wrap)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <div ref={wrapRef} className={`absolute inset-0 ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
