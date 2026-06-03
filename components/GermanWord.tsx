'use client'
import { useState, useRef, useCallback } from 'react'
import type { AnnotatedWord, WordType } from '@/lib/parseChapter'

const TYPE_STYLES: Record<WordType, { light: string; dark: string; label: string }> = {
  verb:  { light: '#b45309', dark: '#f59e0b', label: 'Verb' },
  conj:  { light: '#6d28d9', dark: '#a78bfa', label: 'Conjunction' },
  adv:   { light: '#047857', dark: '#34d399', label: 'Adverb' },
  adj:   { light: '#92400e', dark: '#fcd34d', label: 'Adjective' },
  masc:  { light: '#1d4ed8', dark: '#60a5fa', label: 'Noun (der)' },
  fem:   { light: '#be185d', dark: '#f472b6', label: 'Noun (die)' },
  neut:  { light: '#15803d', dark: '#4ade80', label: 'Noun (das)' },
  pron:  { light: '#6b7280', dark: '#9ca3af', label: 'Pronoun' },
}

export function GermanWord({ data }: { data: AnnotatedWord }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0, anchorBottom: false })
  const spanRef = useRef<HTMLSpanElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const style = TYPE_STYLES[data.type] ?? TYPE_STYLES.adv

  const computePos = useCallback(() => {
    if (!spanRef.current) return
    const rect = spanRef.current.getBoundingClientRect()
    const tw = 240
    const th = 150
    const vw = window.innerWidth
    const vh = window.innerHeight
    const margin = 28

    let x = rect.left
    if (x + tw > vw - margin) x = vw - tw - margin
    if (x < margin) x = margin

    const spaceBelow = vh - rect.bottom - 8
    const anchorBottom = spaceBelow < th && rect.top > th
    const y = anchorBottom ? rect.top - th - 6 : rect.bottom + 6

    setPos({ x, y, anchorBottom })
  }, [])

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    computePos()
    setVisible(true)
  }, [computePos])

  const hide = useCallback((delay = 150) => {
    hideTimer.current = setTimeout(() => setVisible(false), delay)
  }, [])

  return (
    <>
      <span
        ref={spanRef}
        className="font-semibold cursor-pointer underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity"
        style={{ color: `var(--tw-prose-body, inherit)` }}
        onMouseEnter={show}
        onMouseLeave={() => hide(150)}
        onTouchStart={(e) => { e.preventDefault(); show() }}
        onTouchEnd={() => hide(2500)}
      >
        <style>{`.de-${data.type} { color: ${style.light}; } .dark .de-${data.type} { color: ${style.dark}; }`}</style>
        <span className={`de-${data.type}`}>{data.word}</span>
      </span>

      {visible && (
        <div
          className="fixed z-[200] w-[240px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-3 pointer-events-none"
          style={{ left: pos.x, top: pos.y, boxShadow: 'var(--shadow-section)' }}
        >
          <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-0.5">{data.word}</div>
          <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">{style.label}</div>
          <div className="text-xs text-neutral-700 dark:text-neutral-300 mb-2">{data.translation}</div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 italic border-l-2 border-neutral-300 dark:border-neutral-600 pl-2 leading-relaxed">
            {data.example.replace(/\s*—\s*/g, ' - ')}
          </div>
        </div>
      )}
    </>
  )
}
