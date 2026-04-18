import { useEffect, useRef } from 'react'

interface PCBTraceProps {
  text: string
}

const TO_RAD = Math.PI / 180

// ─── Tuning ──────────────────────────────────────────────────────────────────

const AGENT_COUNT     = 16
const ROUTING_SPEED   = 0.75
const FREE_SPEED      = 0.45
const ROUTE_TURN_P    = 0.025   // per-frame chance to recalculate direction toward target
const FREE_TURN_P     = 0.06    // chaotic turn rate during free walk
const FREE_MODE_P     = 0.004   // per-frame chance an agent enters free walk
const ARRIVAL_R       = 24      // px radius to count as "arrived" at node
const FREE_TTL_MIN    = 85
const FREE_TTL_MAX    = 270
const ROUTE_LIFE_MAX  = 2800    // safety-reset an agent stuck for this many frames

const BASE_WIDTH      = 1.6
const RANGE_WIDTH     = 1.4

const MIN_NODES       = 18
const MAX_NODES       = 36
const NODE_LIFE_MIN   = 42000   // ms
const NODE_LIFE_MAX   = 78000
const NODE_SPAWN_GAP  = 145     // frames between node-spawn attempts when below MIN

const VIA_R_MIN       = 2.2
const VIA_R_MAX       = 4.4
const VIA_LIFE_MIN    = 6000
const VIA_LIFE_MAX    = 14000

// Fade alpha: traces drawn into the buffer dim each frame by this factor.
// At 0.08, a trace becomes ~1% brightness after ~55 frames (< 1 s at 60 fps).
const FADE_ALPHA      = 0.08
// 30-second clear: temporarily raise fade rate and STOP redrawing nodes/vias,
// so everything genuinely clears (fixes the persistence bug).
const CLEAR_CYCLE_MS  = 30000
const CLEAR_FADE_MS   = 3200
const CLEAR_ALPHA     = 0.25

const ANGLES_DEG      = [0, 45, 90, 135, 180, 225, 270, 315]
const COMP_KINDS      = ['resistor', 'capacitor', 'soic8', 'sot23', 'crystal', 'diode'] as const
type  ComponentKind   = typeof COMP_KINDS[number]

// ─── Types ───────────────────────────────────────────────────────────────────

type PCBNode = {
  id: number
  x: number; y: number; angle: number
  kind: ComponentKind
  hue: number
  createdAt: number; lifeMs: number
  connections: number[]   // IDs of connected peer nodes
}

type Agent = {
  x: number; y: number; px: number; py: number
  dir: number
  mode: 'routing' | 'free'
  targetId: number | null
  sourceId: number | null
  freeLife: number; freeTTL: number
  routeLife: number
  width: number; hue: number
}

type Via = {
  x: number; y: number; r: number
  createdAt: number; lifeMs: number; hue: number
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PCBTraceAnimation({ text }: PCBTraceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (!canvasRef.current) {
      const c = document.createElement('canvas')
      c.style.cssText = 'position:absolute;top:0;left:0'
      canvasRef.current = c
      containerRef.current.appendChild(c)
    }

    const canvasEl  = canvasRef.current
    const canvasCtx = canvasEl.getContext('2d')!
    const bufferEl  = document.createElement('canvas')
    const bufferCtx = bufferEl.getContext('2d')!
    const dpr       = Math.max(1, window.devicePixelRatio || 1)

    let nodes:      PCBNode[] = []
    let agents:     Agent[]   = []
    let vias:       Via[]     = []
    let nodeIdSeq   = 0
    let frameCount  = 0
    let animId      = 0

    let clearCycleStart = 0
    let inClearFade     = false
    let clearFadeStart  = 0

    // ── Helpers ───────────────────────────────────────────────────────────

    const rand    = (a: number, b: number) => a + Math.random() * (b - a)
    const randInt = (a: number, b: number) => Math.floor(a + Math.random() * (b - a + 1))
    const randHue = () => 200 + Math.random() * 25
    const randKind = (): ComponentKind => COMP_KINDS[Math.floor(Math.random() * COMP_KINDS.length)]
    const randDir  = () => ANGLES_DEG[Math.floor(Math.random() * ANGLES_DEG.length)] * TO_RAD

    /** Best allowed 45° direction from (x,y) toward (tx,ty) */
    function dirToward(x: number, y: number, tx: number, ty: number): number {
      const bear = Math.atan2(ty - y, tx - x)
      let best = 0, bestD = Infinity
      for (const deg of ANGLES_DEG) {
        const r = deg * TO_RAD
        let d = Math.abs(r - bear)
        if (d > Math.PI) d = 2 * Math.PI - d
        if (d < bestD) { bestD = d; best = r }
      }
      return best
    }

    function nodeById(id: number | null): PCBNode | undefined {
      if (id === null) return undefined
      return nodes.find(n => n.id === id)
    }

    /**
     * Nearest node to (x,y), excluding excludeId.
     * Prefers nodes not yet connected to fromId; falls back to any node.
     */
    function nearestNode(
      x: number, y: number,
      excludeId: number | null,
      fromId: number | null
    ): PCBNode | null {
      let best: PCBNode | null = null, bestD = Infinity
      // pass 1: prefer unconnected
      for (const n of nodes) {
        if (n.id === excludeId) continue
        if (fromId !== null && n.connections.includes(fromId)) continue
        const d = (n.x - x) ** 2 + (n.y - y) ** 2
        if (d < bestD) { bestD = d; best = n }
      }
      if (best) return best
      // pass 2: any other node
      for (const n of nodes) {
        if (n.id === excludeId) continue
        const d = (n.x - x) ** 2 + (n.y - y) ** 2
        if (d < bestD) { bestD = d; best = n }
      }
      return best
    }

    // ── Node lifecycle ────────────────────────────────────────────────────

    function makeNode(x: number, y: number, now: number): PCBNode {
      return {
        id: nodeIdSeq++, x, y,
        angle: randDir(), kind: randKind(), hue: randHue(),
        createdAt: now, lifeMs: rand(NODE_LIFE_MIN, NODE_LIFE_MAX),
        connections: [],
      }
    }

    function initNodes(now: number) {
      const w = window.innerWidth, h = window.innerHeight, m = 60
      for (let i = 0; i < MIN_NODES; i++)
        nodes.push(makeNode(rand(m, w - m), rand(m, h - m), now - rand(0, 8000)))
    }

    function tickNodes(now: number) {
      nodes = nodes.filter(n => now - n.createdAt < n.lifeMs)
      if (nodes.length < MAX_NODES && frameCount % NODE_SPAWN_GAP === 0) {
        const w = window.innerWidth, h = window.innerHeight, m = 60
        nodes.push(makeNode(rand(m, w - m), rand(m, h - m), now))
      }
    }

    // ── Agent lifecycle ───────────────────────────────────────────────────

    function makeAgent(): Agent {
      const w = window.innerWidth, h = window.innerHeight
      let x = rand(40, w - 40), y = rand(40, h - 40)
      let sourceId: number | null = null
      if (nodes.length > 0) {
        const n = nodes[Math.floor(Math.random() * nodes.length)]
        x = n.x; y = n.y; sourceId = n.id
      }
      const target = nearestNode(x, y, sourceId, sourceId)
      return {
        x, y, px: x, py: y,
        dir: target ? dirToward(x, y, target.x, target.y) : randDir(),
        mode: 'routing',
        targetId: target?.id ?? null, sourceId,
        freeLife: 0, freeTTL: 0, routeLife: 0,
        width: rand(BASE_WIDTH, BASE_WIDTH + RANGE_WIDTH), hue: randHue(),
      }
    }

    function initAgents() {
      for (let i = 0; i < AGENT_COUNT; i++) agents.push(makeAgent())
    }

    // ── Via helpers ───────────────────────────────────────────────────────

    function dropVia(x: number, y: number, hue: number) {
      vias.push({
        x, y, r: rand(VIA_R_MIN, VIA_R_MAX),
        createdAt: performance.now(),
        lifeMs: rand(VIA_LIFE_MIN, VIA_LIFE_MAX), hue,
      })
    }

    // ── Resize ────────────────────────────────────────────────────────────

    function resize() {
      const { innerWidth: w, innerHeight: h } = window;
      [canvasEl, bufferEl].forEach(el => { el.width = w * dpr; el.height = h * dpr })
      canvasEl.style.width = `${w}px`; canvasEl.style.height = `${h}px`
      canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bufferCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bufferCtx.lineCap = 'square'
    }

    // ── Drawing: trace segments ───────────────────────────────────────────

    function drawSegment(px: number, py: number, x: number, y: number, w: number, hue: number) {
      if (Math.abs(x - px) > 100 || Math.abs(y - py) > 100) return
      bufferCtx.save()
      bufferCtx.globalCompositeOperation = 'lighter'
      bufferCtx.shadowBlur = 4
      bufferCtx.shadowColor = `hsla(${hue},80%,50%,0.5)`
      bufferCtx.strokeStyle = `hsla(${hue},80%,55%,0.28)`
      bufferCtx.lineWidth = w
      bufferCtx.beginPath()
      bufferCtx.moveTo(px, py)
      bufferCtx.lineTo(x, y)
      bufferCtx.stroke()
      bufferCtx.restore()
    }

    // ── Drawing: vias ─────────────────────────────────────────────────────

    function drawVia(v: Via, now: number) {
      const t = Math.max(0, Math.min(1, (now - v.createdAt) / v.lifeMs))
      const a = (1 - t) * 0.3
      bufferCtx.save()
      bufferCtx.globalCompositeOperation = 'lighter'
      bufferCtx.shadowBlur = 6
      bufferCtx.shadowColor = `hsla(${v.hue},80%,55%,${a})`
      bufferCtx.strokeStyle = `hsla(${v.hue},80%,55%,${a})`
      bufferCtx.lineWidth = 1.6
      bufferCtx.beginPath(); bufferCtx.arc(v.x, v.y, v.r, 0, Math.PI * 2); bufferCtx.stroke()
      bufferCtx.shadowBlur = 0
      bufferCtx.fillStyle = `rgba(0,0,0,${0.55 * (1 - t)})`
      bufferCtx.beginPath(); bufferCtx.arc(v.x, v.y, Math.max(0.8, v.r * 0.45), 0, Math.PI * 2); bufferCtx.fill()
      bufferCtx.restore()
    }

    // ── Drawing: footprints ───────────────────────────────────────────────

    /** Sets up translate/rotate/composite and returns stroke color string */
    function fpSetup(x: number, y: number, angle: number, a: number, hue: number): string {
      bufferCtx.save()
      bufferCtx.translate(x, y)
      bufferCtx.rotate(angle)
      bufferCtx.globalCompositeOperation = 'lighter'
      const s = `hsla(${hue},70%,62%,${a})`
      bufferCtx.strokeStyle = s
      bufferCtx.fillStyle   = `hsla(${hue},70%,62%,${a * 0.12})`
      bufferCtx.lineWidth   = 0.9
      return s
    }

    function drawResistor(x: number, y: number, angle: number, a: number, hue: number) {
      fpSetup(x, y, angle, a, hue)
      const bw = 15, bh = 6, pw = 5, ph = 5
      bufferCtx.beginPath(); bufferCtx.rect(-bw/2, -bh/2, bw, bh); bufferCtx.fill(); bufferCtx.stroke()
      bufferCtx.strokeRect(-bw/2 - pw, -ph/2, pw, ph)
      bufferCtx.strokeRect(bw/2, -ph/2, pw, ph)
      bufferCtx.restore()
    }

    function drawCapacitor(x: number, y: number, angle: number, a: number, hue: number) {
      fpSetup(x, y, angle, a, hue)
      const bw = 13, bh = 6, pw = 5, ph = 5
      bufferCtx.beginPath(); bufferCtx.rect(-bw/2, -bh/2, bw, bh); bufferCtx.fill(); bufferCtx.stroke()
      bufferCtx.lineWidth = 0.7
      bufferCtx.beginPath(); bufferCtx.moveTo(-bw/2 + 2.5, 0); bufferCtx.lineTo(-bw/2 + 5.5, 0); bufferCtx.stroke()
      bufferCtx.beginPath(); bufferCtx.moveTo(-bw/2 + 4, -1.5); bufferCtx.lineTo(-bw/2 + 4, 1.5); bufferCtx.stroke()
      bufferCtx.lineWidth = 0.9
      bufferCtx.strokeRect(-bw/2 - pw, -ph/2, pw, ph)
      bufferCtx.strokeRect(bw/2, -ph/2, pw, ph)
      bufferCtx.restore()
    }

    function drawDiode(x: number, y: number, angle: number, a: number, hue: number) {
      fpSetup(x, y, angle, a, hue)
      const bw = 14, bh = 6, pw = 4, ph = 5
      bufferCtx.beginPath(); bufferCtx.rect(-bw/2, -bh/2, bw, bh); bufferCtx.fill(); bufferCtx.stroke()
      bufferCtx.lineWidth = 1.2
      bufferCtx.beginPath(); bufferCtx.moveTo(bw/2 - 3, -bh/2 + 0.5); bufferCtx.lineTo(bw/2 - 3, bh/2 - 0.5); bufferCtx.stroke()
      bufferCtx.lineWidth = 0.9
      bufferCtx.strokeRect(-bw/2 - pw, -ph/2, pw, ph)
      bufferCtx.strokeRect(bw/2, -ph/2, pw, ph)
      bufferCtx.restore()
    }

    function drawSOIC8(x: number, y: number, angle: number, a: number, hue: number) {
      const stroke = fpSetup(x, y, angle, a, hue)
      const bw = 22, bh = 14, pdW = 2.5, pdH = 5.5, sp = 4, n = 4, span = (n - 1) * sp
      bufferCtx.beginPath(); bufferCtx.rect(-bw/2, -bh/2, bw, bh); bufferCtx.fill(); bufferCtx.stroke()
      bufferCtx.fillStyle = stroke
      bufferCtx.beginPath(); bufferCtx.arc(-bw/2 + 2.5, -bh/2 + 2.5, 1.2, 0, Math.PI * 2); bufferCtx.fill()
      for (let p = 0; p < n; p++) {
        const px = -span / 2 + p * sp
        bufferCtx.strokeRect(px - pdW / 2, bh / 2, pdW, pdH)
        bufferCtx.strokeRect(span / 2 - p * sp - pdW / 2, -bh / 2 - pdH, pdW, pdH)
      }
      bufferCtx.restore()
    }

    function drawSOT23(x: number, y: number, angle: number, a: number, hue: number) {
      fpSetup(x, y, angle, a, hue)
      const bw = 7, bh = 7, pw = 3.5, ph = 2.2
      bufferCtx.beginPath(); bufferCtx.rect(-bw/2, -bh/2, bw, bh); bufferCtx.fill(); bufferCtx.stroke()
      bufferCtx.strokeRect(-bw/2 - 0.5, bh/2, pw, ph)
      bufferCtx.strokeRect(bw/2 - pw + 0.5, bh/2, pw, ph)
      bufferCtx.strokeRect(-pw/2, -bh/2 - ph, pw, ph)
      bufferCtx.restore()
    }

    function drawCrystal(x: number, y: number, angle: number, a: number, hue: number) {
      fpSetup(x, y, angle, a, hue)
      const bw = 20, bh = 8, pw = 4, ph = 7
      bufferCtx.beginPath(); bufferCtx.rect(-bw/2, -bh/2, bw, bh); bufferCtx.fill(); bufferCtx.stroke()
      bufferCtx.lineWidth = 0.7
      bufferCtx.beginPath(); bufferCtx.moveTo(-bw/4, -bh/2); bufferCtx.lineTo(-bw/4, bh/2); bufferCtx.stroke()
      bufferCtx.beginPath(); bufferCtx.moveTo(bw/4, -bh/2); bufferCtx.lineTo(bw/4, bh/2); bufferCtx.stroke()
      bufferCtx.lineWidth = 0.9
      bufferCtx.strokeRect(-bw/2 - pw, -ph/2, pw, ph)
      bufferCtx.strokeRect(bw/2, -ph/2, pw, ph)
      bufferCtx.restore()
    }

    function drawNode(node: PCBNode, now: number) {
      const age    = now - node.createdAt
      const t      = Math.max(0, Math.min(1, age / node.lifeMs))
      const fadeIn = Math.min(1, age / 800)
      const alpha  = fadeIn * (1 - t) * 0.24
      if (alpha < 0.003) return
      const { x, y, angle, kind, hue } = node
      switch (kind) {
        case 'resistor':  drawResistor(x, y, angle, alpha, hue);  break
        case 'capacitor': drawCapacitor(x, y, angle, alpha, hue); break
        case 'diode':     drawDiode(x, y, angle, alpha, hue);     break
        case 'soic8':     drawSOIC8(x, y, angle, alpha, hue);     break
        case 'sot23':     drawSOT23(x, y, angle, alpha, hue);     break
        case 'crystal':   drawCrystal(x, y, angle, alpha, hue);  break
      }
    }

    // ── Agent update ──────────────────────────────────────────────────────

    function updateAgents() {
      const w = window.innerWidth, h = window.innerHeight

      for (const agent of agents) {
        agent.px = agent.x
        agent.py = agent.y

        if (agent.mode === 'free') {
          // ── free walk ──────────────────────────────────────────────
          if (Math.random() < FREE_TURN_P) agent.dir = randDir()
          agent.x += Math.cos(agent.dir) * FREE_SPEED
          agent.y += Math.sin(agent.dir) * FREE_SPEED
          if (Math.random() < 0.004) dropVia(agent.x, agent.y, agent.hue)
          agent.freeLife++

          if (agent.freeLife >= agent.freeTTL) {
            // return to routing toward nearest node
            agent.mode = 'routing'
            const t = nearestNode(agent.x, agent.y, agent.sourceId, agent.sourceId)
            agent.targetId = t?.id ?? null
            if (t) agent.dir = dirToward(agent.x, agent.y, t.x, t.y)
            agent.routeLife = 0
          }
        } else {
          // ── routing ────────────────────────────────────────────────
          let target = nodeById(agent.targetId)

          // Target expired? Find a new one.
          if (!target) {
            const t = nearestNode(agent.x, agent.y, agent.sourceId, agent.sourceId)
            agent.targetId = t?.id ?? null
            agent.routeLife = 0
            target = t ?? undefined
            if (target) agent.dir = dirToward(agent.x, agent.y, target.x, target.y)
          }

          // Maybe enter free walk
          if (Math.random() < FREE_MODE_P) {
            agent.mode = 'free'
            agent.freeLife = 0
            agent.freeTTL = randInt(FREE_TTL_MIN, FREE_TTL_MAX)
            agent.dir = randDir()
          } else if (target) {
            // Steer: recalculate on chance OR if heading >100° away from target
            const bear = Math.atan2(target.y - agent.y, target.x - agent.x)
            let angleDiff = Math.abs(agent.dir - bear)
            if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff
            if (angleDiff > Math.PI * 0.55 || Math.random() < ROUTE_TURN_P) {
              agent.dir = dirToward(agent.x, agent.y, target.x, target.y)
            }

            // Arrival check
            const dx = target.x - agent.x, dy = target.y - agent.y
            if (dx * dx + dy * dy < ARRIVAL_R * ARRIVAL_R) {
              dropVia(agent.x, agent.y, agent.hue)
              // Record bidirectional connection
              if (agent.sourceId !== null) {
                if (!target.connections.includes(agent.sourceId)) target.connections.push(agent.sourceId)
                const src = nodeById(agent.sourceId)
                if (src && !src.connections.includes(target.id)) src.connections.push(target.id)
              }
              // Hop: source becomes old target, find next
              agent.x = target.x; agent.y = target.y
              agent.sourceId = target.id
              const next = nearestNode(target.x, target.y, target.id, target.id)
              agent.targetId = next?.id ?? null
              agent.routeLife = 0
              if (next) agent.dir = dirToward(target.x, target.y, next.x, next.y)
            }
          }

          agent.x += Math.cos(agent.dir) * ROUTING_SPEED
          agent.y += Math.sin(agent.dir) * ROUTING_SPEED
          agent.routeLife++

          // Safety: reset if stuck too long
          if (agent.routeLife > ROUTE_LIFE_MAX) {
            const fresh = makeAgent()
            Object.assign(agent, fresh)
          }
        }

        drawSegment(agent.px, agent.py, agent.x, agent.y, agent.width, agent.hue)

        // Wrap edges
        if (agent.x > w) agent.x = 0
        if (agent.x < 0) agent.x = w
        if (agent.y > h) agent.y = 0
        if (agent.y < 0) agent.y = h
      }
    }

    // ── Buffer fade + persistent element redraw ───────────────────────────
    //
    // The key fix for trace persistence: during the 30-second clear phase we
    // use a stronger fade AND skip redrawing nodes/vias, so they cannot cancel
    // out the fade in their areas. Everything truly clears to black.

    function fadeBuffer(now: number) {
      // 30-second cycle management
      if (!inClearFade && now - clearCycleStart > CLEAR_CYCLE_MS) {
        inClearFade = true; clearFadeStart = now
      }
      if (inClearFade && now - clearFadeStart > CLEAR_FADE_MS) {
        inClearFade = false; clearCycleStart = now
      }

      // Apply fade rect to buffer
      bufferCtx.globalCompositeOperation = 'source-over'
      bufferCtx.fillStyle = `rgba(0,0,0,${inClearFade ? CLEAR_ALPHA : FADE_ALPHA})`
      bufferCtx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // During clear phase: just prune expired elements, do NOT redraw them —
      // this is what allows the buffer to actually reach black.
      if (inClearFade) {
        vias  = vias.filter(v => now - v.createdAt < v.lifeMs)
        return
      }

      // Normal frame: redraw vias and node footprints so they persist
      vias = vias.filter(v => {
        if (now - v.createdAt >= v.lifeMs) return false
        drawVia(v, now)
        return true
      })
      for (const node of nodes) drawNode(node, now)
    }

    // ── Main render loop ──────────────────────────────────────────────────

    function frame() {
      const w = window.innerWidth, h = window.innerHeight
      const now = performance.now()
      frameCount++

      tickNodes(now)         // expire old nodes, maybe spawn new
      fadeBuffer(now)        // fade buffer + redraw persistent elements
      updateAgents()      // move agents, draw trace segments into buffer

      // Composite buffer → main canvas
      canvasCtx.clearRect(0, 0, w, h)
      canvasCtx.globalCompositeOperation = 'lighter'
      canvasCtx.drawImage(bufferEl, 0, 0, w, h)
      canvasCtx.globalCompositeOperation = 'source-atop'
      canvasCtx.fillStyle = 'rgba(16,185,129,0.35)'
      canvasCtx.fillRect(0, 0, w, h)
      canvasCtx.globalCompositeOperation = 'source-over'

      // Draw agent heads on top of the canvas
      for (const agent of agents) {
        canvasCtx.fillStyle = 'rgba(74,222,128,0.9)'
        canvasCtx.beginPath()
        canvasCtx.arc(agent.x, agent.y, 1.2, 0, Math.PI * 2)
        canvasCtx.fill()
      }

      animId = requestAnimationFrame(frame)
    }

    // ── Init ──────────────────────────────────────────────────────────────

    resize()
    const now0 = performance.now()
    clearCycleStart = now0
    initNodes(now0)
    initAgents()
    frame()

    const onResize = () => {
      resize()
      const t = performance.now()
      clearCycleStart = t
      inClearFade = false
      nodes = []; vias = []; agents = []
      initNodes(t)
      initAgents()
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animId)
    }
  }, [text])

  return (
    <div ref={containerRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="relative z-10 text-center select-none pointer-events-none">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-slate-100 tracking-tighter opacity-90">
          {text}
        </h1>
      </div>
    </div>
  )
}
