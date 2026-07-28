'use client'

import { memo, useMemo, useState } from 'react'
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
  reduceMotion,
}: {
  star: Star
  reduceMotion: boolean
}) {
  // Stable keyframe array per star — computed once and never changes, so
  // Framer Motion never restarts the loop.
  const idleKeyframes = useMemo(
    () => [star.opacity, star.opacity * 0.25, star.opacity],
    [star.opacity]
  )

  const animate = reduceMotion ? { opacity: star.opacity } : { opacity: idleKeyframes }

  const transition = reduceMotion
    ? { duration: 0.3 }
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
    />
  )
})

function Stars() {
  const [stars] = useState<Star[]>(generateStars)
  const reduceMotion = useReducedMotion()

  return (
    <div className="absolute inset-0">
      {stars.map((star, i) => (
        <StarDot key={i} star={star} reduceMotion={!!reduceMotion} />
      ))}
    </div>
  )
}

export function GlareCard({ className = '', children }: CardProps) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-xl border border-neutral-600 bg-[linear-gradient(110deg,#2a2a2a_0%,#191919_60%)] ${className}`}
    >
      <Stars />
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