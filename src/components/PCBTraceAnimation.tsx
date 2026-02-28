import { useEffect, useRef } from 'react'

interface PCBTraceProps {
  text: string
}

const TO_RAD = Math.PI / 180
const pipeCount = 25
const pipePropCount = 10
const pipePropsLength = pipeCount * pipePropCount

// Movement tuning
const baseSpeed = 0.3
const baseTTL = 500
const rangeTTL = 600
const baseWidth = 2.8
const rangeWidth = 1.5

// PCB Angular logic
const turnChance = 0.006
const allowedAngles = [0, 45, 90, 135, 180, 225, 270, 315]

// --- VIA (PCB "hole") system ---
type Via = {
  x: number
  y: number
  r: number
  createdAt: number
  lifeMs: number
  hue: number
}

const viaChanceNearDeath = 0.45 // chance to drop a via when close to dying
const viaNearDeathWindow = 20   // how close to death (in frames) counts as "about to die"
const viaRadiusMin = 2.2
const viaRadiusMax = 4.0
const viaLifeMsMin = 5000       // vias fade out over time (prevents crowding)
const viaLifeMsMax = 11000

// Buffer fade: controls how quickly ALL trails disappear (prevents crowding).
// Higher = faster clearing. Lower = longer persistence.
const bufferFadeAlpha = 0.05 // keep close to earlier "0.03" behavior

export function PCBTraceAnimation({ text }: PCBTraceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (!canvasRef.current) {
      const c = document.createElement('canvas')
      c.style.position = 'absolute'
      c.style.top = '0'
      c.style.left = '0'
      canvasRef.current = c
      containerRef.current.appendChild(c)
    }

    const canvasEl = canvasRef.current
    const canvasCtx = canvasEl.getContext('2d')!
    const bufferEl = document.createElement('canvas')
    const bufferCtx = bufferEl.getContext('2d')!

    const dpr = Math.max(1, window.devicePixelRatio || 1)
    let pipeProps = new Float32Array(pipePropsLength)
    let animationId = 0

    // via storage
    let vias: Via[] = []
    // prevent multiple via drops for the same pipe near the end of life
    const droppedViaFlag = new Uint8Array(pipeCount)

    function getRandomAngle() {
      return allowedAngles[Math.floor(Math.random() * allowedAngles.length)] * TO_RAD
    }

    function rand(min: number, max: number) {
      return min + Math.random() * (max - min)
    }

    function initPipes() {
      const w = window.innerWidth
      const h = window.innerHeight
      for (let i = 0; i < pipePropsLength; i += pipePropCount) {
        const x = Math.random() * w
        const y = Math.random() * h
        const dir = getRandomAngle()
        // x, y, px, py, dir, speed, life, ttl, width, hue
        pipeProps.set(
          [
            x, y, x, y,
            dir,
            baseSpeed,
            0,
            baseTTL + Math.random() * rangeTTL,
            baseWidth + Math.random() * rangeWidth,
            210 + Math.random() * 20,
          ],
          i
        )
      }
      droppedViaFlag.fill(0)
    }

    function resize() {
      const { innerWidth, innerHeight } = window
      canvasEl.width = innerWidth * dpr
      canvasEl.height = innerHeight * dpr
      canvasEl.style.width = `${innerWidth}px`
      canvasEl.style.height = `${innerHeight}px`
      bufferEl.width = innerWidth * dpr
      bufferEl.height = innerHeight * dpr

      canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bufferCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bufferCtx.lineCap = 'square'
    }

    function drawGlowSegment(
      px: number,
      py: number,
      x: number,
      y: number,
      life: number,
      ttl: number,
      width: number,
      hue: number
    ) {
      if (Math.abs(x - px) > 50 || Math.abs(y - py) > 50) return

      const alpha = Math.min(0.25, 1 - life / ttl)

      bufferCtx.save()
      bufferCtx.shadowBlur = 4
      bufferCtx.shadowColor = `hsla(${hue}, 80%, 50%, 0.6)`
      bufferCtx.strokeStyle = `hsla(${hue}, 80%, 50%, ${alpha})`
      bufferCtx.lineWidth = width
      bufferCtx.beginPath()
      bufferCtx.moveTo(px, py)
      bufferCtx.lineTo(x, y)
      bufferCtx.stroke()
      bufferCtx.restore()
    }

    function drawViaToBuffer(v: Via, now: number) {
      const age = now - v.createdAt
      const t = Math.max(0, Math.min(1, age / v.lifeMs))
      // fade out as it ages
      const a = (1 - t) * 0.28

      // Outer ring + inner "hole" gives a via feel
      bufferCtx.save()
      bufferCtx.globalCompositeOperation = 'lighter'

      bufferCtx.shadowBlur = 6
      bufferCtx.shadowColor = `hsla(${v.hue}, 80%, 55%, ${a})`
      bufferCtx.strokeStyle = `hsla(${v.hue}, 80%, 55%, ${a})`
      bufferCtx.lineWidth = 1.6

      bufferCtx.beginPath()
      bufferCtx.arc(v.x, v.y, v.r, 0, Math.PI * 2)
      bufferCtx.stroke()

      // inner hole (dark center)
      bufferCtx.shadowBlur = 0
      bufferCtx.fillStyle = `rgba(0, 0, 0, ${0.55 * (1 - t)})`
      bufferCtx.beginPath()
      bufferCtx.arc(v.x, v.y, Math.max(0.8, v.r * 0.45), 0, Math.PI * 2)
      bufferCtx.fill()

      bufferCtx.restore()
    }

    function maybeDropVia(pipeIndex: number, x: number, y: number, life: number, ttl: number, hue: number) {
      // near death window check
      if (ttl - life > viaNearDeathWindow) return
      // only once per TTL cycle
      if (droppedViaFlag[pipeIndex]) return
      if (Math.random() > viaChanceNearDeath) return

      droppedViaFlag[pipeIndex] = 1

      const now = performance.now()
      vias.push({
        x,
        y,
        r: rand(viaRadiusMin, viaRadiusMax),
        createdAt: now,
        lifeMs: rand(viaLifeMsMin, viaLifeMsMax),
        hue,
      })
    }

    function updatePipes() {
      const w = window.innerWidth
      const h = window.innerHeight

      for (let i = 0; i < pipePropsLength; i += pipePropCount) {
        const pipeIndex = i / pipePropCount

        let x = pipeProps[i],
          y = pipeProps[i + 1],
          px = x,
          py = y

        let dir = pipeProps[i + 4],
          speed = pipeProps[i + 5],
          life = pipeProps[i + 6],
          ttl = pipeProps[i + 7]

        const width = pipeProps[i + 8],
          hue = pipeProps[i + 9]

        if (Math.random() < turnChance) {
          dir = getRandomAngle()
        }

        x += Math.cos(dir) * speed
        y += Math.sin(dir) * speed

        // draw segment into buffer (persistent trail layer)
        drawGlowSegment(px, py, x, y, life, ttl, width, hue)

        // if close to dying, maybe drop a via at current location
        maybeDropVia(pipeIndex, x, y, life, ttl, hue)

        // wrap
        if (x > w) x = 0
        if (x < 0) x = w
        if (y > h) y = 0
        if (y < 0) y = h

        pipeProps[i] = x
        pipeProps[i + 1] = y
        pipeProps[i + 2] = px
        pipeProps[i + 3] = py
        pipeProps[i + 4] = dir
        pipeProps[i + 6] = life + 1

        // reset pipe when it "dies"
        if (life > ttl) {
          const rx = Math.random() * w
          const ry = Math.random() * h
          pipeProps.set(
            [
              rx, ry, rx, ry,
              getRandomAngle(),
              baseSpeed,
              0,
              baseTTL + Math.random() * rangeTTL,
              baseWidth + Math.random() * rangeWidth,
              210 + Math.random() * 20,
            ],
            i
          )
          // allow via drop again on next life
          droppedViaFlag[pipeIndex] = 0
        }
      }
    }

    function fadeAndRenderViasIntoBuffer(now: number) {
      // Fade the buffer so old traces slowly disappear (prevents crowding).
      // This keeps trails, but guarantees they eventually clear.
      bufferCtx.globalCompositeOperation = 'source-over'
      bufferCtx.fillStyle = `rgba(0, 0, 0, ${bufferFadeAlpha})`
      bufferCtx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // Draw vias each frame so they persist and then fade based on their own TTL.
      // Also prune old vias.
      const next: Via[] = []
      for (const v of vias) {
        if (now - v.createdAt < v.lifeMs) {
          drawViaToBuffer(v, now)
          next.push(v)
        }
      }
      vias = next
    }

    function frame() {
      const w = window.innerWidth
      const h = window.innerHeight
      const now = performance.now()

      // 1) Fade buffer + draw vias into buffer (so both traces and vias eventually clear)
      fadeAndRenderViasIntoBuffer(now)

      // 2) Draw buffer into main canvas
      canvasCtx.clearRect(0, 0, w, h)

      // draw trails normally
      canvasCtx.globalCompositeOperation = 'lighter'
      canvasCtx.drawImage(bufferEl, 0, 0, w, h)

      // mint tint ONLY on trail pixels (no background flood)
      canvasCtx.globalCompositeOperation = 'source-atop'
      canvasCtx.fillStyle = 'rgba(16, 185, 129, 0.35)'
      canvasCtx.fillRect(0, 0, w, h)

      // restore
      canvasCtx.globalCompositeOperation = 'source-over'

      // 3) Update pipes (draws segments into buffer for next frame)
      updatePipes()

      // 4) Draw the "leads" (current position) on top
      for (let i = 0; i < pipePropsLength; i += pipePropCount) {
        const x = pipeProps[i]
        const y = pipeProps[i + 1]
        const life = pipeProps[i + 6]
        const ttl = pipeProps[i + 7]

        const headAlpha = Math.min(1, 1.5 - (life / ttl) * 1.5)
        canvasCtx.fillStyle = `rgba(74, 222, 128, ${headAlpha})`
        canvasCtx.beginPath()
        canvasCtx.arc(x, y, 1.2, 0, Math.PI * 2)
        canvasCtx.fill()
      }

      animationId = requestAnimationFrame(frame)
    }

    resize()
    initPipes()
    frame()

    const onResize = () => {
      resize()
      initPipes()
      // also clear vias so they don't get weirdly scaled/positioned after resize
      vias = []
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationId)
    }
  }, [text])

  return (
    <div ref={containerRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="relative z-10 text-center select-none pointer-events-none">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-slate-100 tracking-tighter opacity-90">
          {text}
        </h1>
          <p className="text-base md:text-lg font-mono font-normal leading-relaxed text-slate-100 opacity-90">This background is supposed to be an autogenerated random PCB lol</p>
      </div>
    </div>
  )
}
