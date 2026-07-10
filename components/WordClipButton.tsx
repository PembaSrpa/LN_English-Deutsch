'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconPaperclip } from '@tabler/icons-react'
import { getClipPosition, setClipPosition, type ClipPosition } from '@/lib/storage'
import { useClipMode } from './ClipModeContext'

const SIZE = 46
const EDGE_PAD = 8
const DRAG_THRESHOLD = 6

// Clamp horizontally to the page width (no horizontal scroll in this layout,
// so viewport width doubles as document width). Vertically we only clamp the
// top edge — the button lives in document flow, so there's no upper bound
// once content has been scrolled.
function clampX(x: number): number {
  const maxX = Math.max(EDGE_PAD, window.innerWidth - SIZE - EDGE_PAD)
  return Math.min(Math.max(x, EDGE_PAD), maxX)
}

export function WordClipButton() {
  const { active, toggle } = useClipMode()
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState<ClipPosition>({ x: 0, y: 0 })
  const posRef = useRef(pos)
  const dragging = useRef(false)
  const moved = useRef(false)
  // start.px/py are viewport (pointer) coordinates at drag start;
  // start.x/y are the button's document coordinates at drag start.
  const start = useRef({ x: 0, y: 0, px: 0, py: 0 })

  useEffect(() => {
    setMounted(true)
    const saved = getClipPosition()
    const initial = saved
      ? { x: clampX(saved.x), y: Math.max(EDGE_PAD, saved.y) }
      : { x: clampX(window.innerWidth - SIZE - 16), y: window.scrollY + 76 }
    setPos(initial)
    posRef.current = initial

    const onResize = () => {
      setPos((p) => {
        const next = { x: clampX(p.x), y: p.y }
        posRef.current = next
        return next
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
    const next = { x: clampX(start.current.x + dx), y: Math.max(EDGE_PAD, start.current.y + dy) }
    posRef.current = next
    setPos(next)
  }, [])

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    if (moved.current) {
      setClipPosition(posRef.current)
    } else {
      toggle()
    }
  }, [toggle])

  if (!mounted) return null

  return createPortal(
    <button
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label={active ? 'Stop clipping words' : 'Clip a word'}
      title={active ? 'Tap a word to save it — tap here to stop' : 'Drag to move · tap to clip a word'}
      className={`absolute z-[300] flex items-center justify-center rounded-full border touch-none select-none transition-colors ${
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