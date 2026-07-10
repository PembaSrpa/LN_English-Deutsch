'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconPaperclip } from '@tabler/icons-react'
import { getClipPosition, setClipPosition, type ClipPosition } from '@/lib/storage'
import { useClipMode } from './ClipModeContext'

const SIZE = 46
const EDGE_PAD = 8
const DRAG_THRESHOLD = 6

// Bounds for the IDLE (inactive) resting spot — it's fixed to the viewport,
// so it must stay fully on-screen.
function clampToViewport(p: ClipPosition): ClipPosition {
  const maxX = Math.max(EDGE_PAD, window.innerWidth - SIZE - EDGE_PAD)
  const maxY = Math.max(EDGE_PAD, window.innerHeight - SIZE - EDGE_PAD)
  return {
    x: Math.min(Math.max(p.x, EDGE_PAD), maxX),
    y: Math.min(Math.max(p.y, EDGE_PAD), maxY),
  }
}

// Bounds for the ACTIVE (armed) position — it lives in document flow, so only
// the horizontal axis needs clamping to the page width.
function clampX(x: number): number {
  const maxX = Math.max(EDGE_PAD, window.innerWidth - SIZE - EDGE_PAD)
  return Math.min(Math.max(x, EDGE_PAD), maxX)
}

// Convert whatever coordinate space `p` is currently in back to viewport/fixed
// coordinates, so it can be persisted as the idle resting spot.
function toRestCoords(p: ClipPosition, isActive: boolean): ClipPosition {
  const viewportCoords = isActive ? { x: p.x, y: p.y - window.scrollY } : p
  return clampToViewport(viewportCoords)
}

export function WordClipButton() {
  const { active, toggle } = useClipMode()
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState<ClipPosition>({ x: 0, y: 0 })
  const posRef = useRef(pos)
  const prevActive = useRef(active)
  const dragging = useRef(false)
  const moved = useRef(false)
  const start = useRef({ x: 0, y: 0, px: 0, py: 0 })

  useEffect(() => {
    setMounted(true)
    const saved = getClipPosition()
    const initial = clampToViewport(saved ?? { x: window.innerWidth - SIZE - 16, y: 76 })
    setPos(initial)
    posRef.current = initial

    const onResize = () => {
      setPos((p) => {
        const next = active ? { x: clampX(p.x), y: p.y } : clampToViewport(p)
        posRef.current = next
        return next
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle the black <-> yellow transition: convert coordinates between
  // viewport space (idle) and document space (armed), and persist the idle
  // resting spot every time we drop back into idle.
  useEffect(() => {
    if (prevActive.current === active) return
    prevActive.current = active

    if (active) {
      const docPos = { x: clampX(posRef.current.x), y: posRef.current.y + window.scrollY }
      posRef.current = docPos
      setPos(docPos)
    } else {
      const restPos = toRestCoords(posRef.current, true)
      posRef.current = restPos
      setPos(restPos)
      setClipPosition(restPos)
    }
  }, [active])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    dragging.current = true
    moved.current = false
    start.current = { x: posRef.current.x, y: posRef.current.y, px: e.clientX, py: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return
    const dx = e.clientX - start.current.px
    const dy = e.clientY - start.current.py
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) moved.current = true
    const raw = { x: start.current.x + dx, y: start.current.y + dy }
    const next = active ? { x: clampX(raw.x), y: raw.y } : clampToViewport(raw)
    posRef.current = next
    setPos(next)
  }, [active])

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    if (moved.current) {
      // Persist the idle resting spot regardless of which mode we dragged in,
      // so the position is never lost on refresh.
      setClipPosition(toRestCoords(posRef.current, active))
    } else {
      toggle()
    }
  }, [active, toggle])

  if (!mounted) return null

  return createPortal(
    <button
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label={active ? 'Stop clipping words' : 'Clip a word'}
      title={active ? 'Tap a word to save it — tap here to stop' : 'Drag to move · tap to clip a word'}
      className={`${active ? 'absolute' : 'fixed'} z-[300] flex items-center justify-center rounded-full border touch-none select-none transition-colors ${
        active
          ? 'bg-amber-400 border-amber-300 text-neutral-900'
          : 'bg-neutral-800 border-neutral-600 text-neutral-300'
      }`}
      style={{
        left: pos.x,
        top: pos.y,
        width: SIZE,
        height: SIZE,
        boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
        cursor: 'grab',
      }}
    >
      <IconPaperclip size={20} />
    </button>,
    document.body
  )
}