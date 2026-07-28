'use client'

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type CardProps = {
  className?: string
  children?: React.ReactNode
}

type Star = {
  x: number
  y: number
  radius: number
  opacity: number
  duration: number
  delay: number
}

const NUM_STARS = 90
const NEAR_RADIUS_FACTOR = 0.18

function generateStars(): Star[] {
  return Array.from({ length: NUM_STARS }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    radius: Math.random() * 0.6 + 0.4,
    opacity: Math.random() * 0.5 + 0.15,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * -8, // stagger start so stars don't pulse in sync
  }))
}

const StarDot = memo(function StarDot({
  star,
  near,
  reduceMotion,
}: {
  star: Star
  near: boolean
  reduceMotion: boolean
}) {
  // Stable keyframe array per star — only depends on the star itself, not on
  // mouse position, so Framer Motion never sees a "new" animate target and
  // the ambient twinkle loop is never interrupted.
  const idleKeyframes = useMemo(
    () => [star.opacity, star.opacity * 0.25, star.opacity],
    [star.opacity]
  )

  const animate = reduceMotion
    ? { opacity: star.opacity, scale: near ? 1.5 : 1 }
    : { opacity: near ? 1 : idleKeyframes, scale: near ? 1.5 : 1 }

  const transition = reduceMotion
    ? { duration: 0.3 }
    : near
      ? { duration: 0.5, ease: 'easeOut' as const }
      : {
          duration: star.duration,
          delay: star.delay,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        }

  return (
    <motion.span
      animate={animate}
      transition={transition}
      style={{
        position: 'absolute',
        top: `${star.y}%`,
        left: `${star.x}%`,
        width: `${star.radius}px`,
        height: `${star.radius}px`,
        borderRadius: '9999px',
        backgroundColor: '#fff',
      }}
    >
      {near && !reduceMotion && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100 blur-[3px]"
        />
      )}
    </motion.span>
  )
})

function Stars({
  mouseX,
  mouseY,
  active,
  width,
  height,
}: {
  mouseX: number
  mouseY: number
  active: boolean
  width: number
  height: number
}) {
  const [stars] = useState<Star[]>(generateStars)
  const reduceMotion = useReducedMotion()

  const nearRadius = Math.max(width, height) * NEAR_RADIUS_FACTOR

  return (
    <div className="absolute inset-0">
      {stars.map((star, i) => {
        const sx = (star.x / 100) * width
        const sy = (star.y / 100) * height
        const near =
          active && width > 0 && height > 0 && Math.hypot(sx - mouseX, sy - mouseY) < nearRadius

        return (
          <StarDot key={i} star={star} near={near} reduceMotion={!!reduceMotion} />
        )
      })}
    </div>
  )
}

export function GlareCard({ className = '', children }: CardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const pendingMouse = useRef<{ x: number; y: number } | null>(null)

  const [size, setSize] = useState({ w: 0, h: 0 })
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: width, h: height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    pendingMouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }

    // Throttle state updates to once per animation frame instead of once per
    // pixel of mouse movement, so we're not re-rendering 90 stars on every
    // mousemove event.
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        if (pendingMouse.current) setMouse(pendingMouse.current)
        rafRef.current = null
      })
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`relative h-full w-full overflow-hidden rounded-xl border border-neutral-600 bg-[linear-gradient(110deg,#2a2a2a_0%,#191919_60%)] ${className}`}
    >
      <Stars mouseX={mouse.x} mouseY={mouse.y} active={active} width={size.w} height={size.h} />
      <div className="relative z-40 flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
        {children}
      </div>
    </div>
  )
}

export function GlowingStarsTitle({ className = '', children }: CardProps) {
  return <h2 className={`text-xl font-bold text-neutral-100 ${className}`}>{children}</h2>
}

export function GlowingStarsDescription({ className = '', children }: CardProps) {
  return <p className={`text-sm text-neutral-300 ${className}`}>{children}</p>
}