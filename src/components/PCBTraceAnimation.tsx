import { useEffect, useRef } from 'react'

interface PCBTraceProps {
  text: string
}

const TO_RAD = Math.PI / 180
const pipeCount = 30
const pipePropCount = 10
const pipePropsLength = pipeCount * pipePropCount

// Movement tuning - SLOWED DOWN
const baseSpeed = 0.6 // Reduced from 1.5 for a smoother, methodical draw
const baseTTL = 200   // Increased to allow longer paths at slower speeds
const rangeTTL = 300
const baseWidth = 1.2
const rangeWidth = 0.8

// PCB Angular logic
const turnChance = 0.03 // Slightly lower turn chance for longer straight runs
const allowedAngles = [0, 45, 90, 135, 180, 225, 270, 315]

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

    function getRandomAngle() {
      return allowedAngles[Math.floor(Math.random() * allowedAngles.length)] * TO_RAD
    }

    function initPipes() {
      const w = window.innerWidth
      const h = window.innerHeight
      for (let i = 0; i < pipePropsLength; i += pipePropCount) {
        const x = Math.random() * w
        const y = Math.random() * h
        const dir = getRandomAngle()
        // x, y, px, py, dir, speed, life, ttl, width, hue
        pipeProps.set([
          x, y, x, y, 
          dir, 
          baseSpeed, 
          0, 
          baseTTL + Math.random() * rangeTTL, 
          baseWidth + Math.random() * rangeWidth, 
          210 + Math.random() * 20
        ], i)
      }
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

    function drawGlowSegment(px: number, py: number, x: number, y: number, life: number, ttl: number, width: number, hue: number) {
      if (Math.abs(x - px) > 50 || Math.abs(y - py) > 50) return

      // Fade out more elegantly as they age
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

    function updatePipes() {
      for (let i = 0; i < pipePropsLength; i += pipePropCount) {
        let x = pipeProps[i], y = pipeProps[i+1], px = x, py = y
        let dir = pipeProps[i+4], speed = pipeProps[i+5], life = pipeProps[i+6], ttl = pipeProps[i+7]
        const width = pipeProps[i+8], hue = pipeProps[i+9]

        if (Math.random() < turnChance) {
          dir = getRandomAngle()
        }

        x += Math.cos(dir) * speed
        y += Math.sin(dir) * speed

        drawGlowSegment(px, py, x, y, life, ttl, width, hue)

        if (x > window.innerWidth) x = 0
        if (x < 0) x = window.innerWidth
        if (y > window.innerHeight) y = 0
        if (y < 0) y = window.innerHeight

        pipeProps[i] = x
        pipeProps[i+1] = y
        pipeProps[i+2] = px
        pipeProps[i+3] = py
        pipeProps[i+4] = dir
        pipeProps[i+6] = life + 1

        if (life > ttl) {
          const rx = Math.random() * window.innerWidth
          const ry = Math.random() * window.innerHeight
          pipeProps.set([
            rx, ry, rx, ry, 
            getRandomAngle(), 
            baseSpeed, 
            0, 
            baseTTL + Math.random() * rangeTTL, 
            baseWidth + Math.random() * rangeWidth, 
            210 + Math.random() * 20
          ], i)
        }
      }
    }

    function frame() {
      const w = window.innerWidth
      const h = window.innerHeight

      canvasCtx.clearRect(0, 0, w, h)
      canvasCtx.globalCompositeOperation = 'lighter'
      canvasCtx.drawImage(bufferEl, 0, 0, w, h)

      // Trail persistence logic
      bufferCtx.fillStyle = 'rgba(0, 0, 0, 0.03)'
      bufferCtx.fillRect(0, 0, w, h)

      updatePipes()

      // Drawing the "leads" (current position)
      for (let i = 0; i < pipePropsLength; i += pipePropCount) {
        const x = pipeProps[i]
        const y = pipeProps[i+1]
        const life = pipeProps[i+6]
        const ttl = pipeProps[i+7]
        
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

    const onResize = () => { resize(); initPipes(); }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationId)
    }
  }, [text])

  return (
    <div ref={containerRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="relative z-10 text-center select-none pointer-events-none">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-blue-500 tracking-tighter opacity-90">
          {text}
        </h1>
      </div>
    </div>
  )
}