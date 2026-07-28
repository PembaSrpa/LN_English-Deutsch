'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

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
}

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
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(
      Array.from({ length: 90 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        radius: Math.random() * 0.6 + 0.4,
        opacity: Math.random() * 0.5 + 0.15,
        duration: Math.random() * 8 + 6,
      }))
    )
  }, [])

  function isNear(star: Star) {
    if (!active || !width || !height) return false
    const sx = (star.x / 100) * width
    const sy = (star.y / 100) * height
    return Math.hypot(sx - mouseX, sy - mouseY) < Math.max(width, height) * 0.18
  }

  return (
    <div className="absolute inset-0">
      {stars.map((star, i) => {
        const near = isNear(star)
        return (
          <motion.span
            key={i}
            animate={{
              opacity: near ? 1 : [star.opacity, star.opacity * 0.25, star.opacity],
              scale: near ? 1.7 : 1,
            }}
            transition={
              near
                ? { duration: 0.5, ease: 'easeOut' }
                : { duration: star.duration, repeat: Infinity, ease: 'easeInOut' }
            }
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
            {near && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 blur-[3px]"
              />
            )}
          </motion.span>
        )
      })}
    </div>
  )
}

export function GlareCard({ className = '', children }: CardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
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

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`relative h-full w-full overflow-hidden rounded-xl border border-neutral-600 bg-[linear-gradient(110deg,#2a2a2a_0.6%,#191919)] ${className}`}
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