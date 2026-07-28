'use client'
import { useRef } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
}

export function GlareCard({ children, className = '' }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const rotateX = ((y - 50) / 50) * -6
    const rotateY = ((x - 50) / 50) * 6
    card.style.setProperty('--m-x', `${x}%`)
    card.style.setProperty('--m-y', `${y}%`)
    card.style.setProperty('--r-x', `${rotateX}deg`)
    card.style.setProperty('--r-y', `${rotateY}deg`)
    card.style.setProperty('--opacity', '1')
  }

  function handlePointerLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--r-x', '0deg')
    card.style.setProperty('--r-y', '0deg')
    card.style.setProperty('--opacity', '0')
  }

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative isolate aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-600 bg-neutral-800 transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: 'perspective(600px) rotateX(var(--r-x, 0deg)) rotateY(var(--r-y, 0deg))',
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 z-10 flex items-center justify-center">{children}</div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-[var(--opacity,0)] transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at var(--m-x,50%) var(--m-y,50%), rgba(255,255,255,0.35), transparent 45%)',
        } as React.CSSProperties}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 mix-blend-color-dodge opacity-[var(--opacity,0)] transition-opacity duration-300"
        style={{
          background: 'linear-gradient(115deg, transparent 20%, rgba(120,148,255,0.5) 36%, rgba(255,119,115,0.5) 43%, rgba(168,255,95,0.5) 50%, transparent 68%)',
          backgroundSize: '200% 200%',
          backgroundPosition: 'var(--m-x,50%) var(--m-y,50%)',
        } as React.CSSProperties}
      />
    </div>
  )
}
