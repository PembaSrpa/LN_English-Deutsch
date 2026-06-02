'use client'

import { useState, useRef, useCallback } from 'react'
import type { AnnotatedWord, WordType } from '@/lib/parseChapter'

const TYPE_STYLES: Record<WordType, { bg: string; text: string; darkBg: string; darkText: string; label: string }> = {
  verb:  { bg: '#FFF3E0', text: '#8B5E00', darkBg: '#3D2800', darkText: '#FFB74D', label: 'Verb' },
  conj:  { bg: '#F3F0FF', text: '#5B47B0', darkBg: '#1E1640', darkText: '#B39DDB', label: 'Conjunction' },
  adv:   { bg: '#E8F5EF', text: '#1B6B45', darkBg: '#0A2B1A', darkText: '#69F0AE', label: 'Adverb' },
  adj:   { bg: '#FFF8E1', text: '#8B6914', darkBg: '#2E2000', darkText: '#FFD54F', label: 'Adjective' },
  masc:  { bg: '#E3F0FF', text: '#1A5FA6', darkBg: '#0D2540', darkText: '#64B5F6', label: 'Noun (der)' },
  fem:   { bg: '#FFF0F5', text: '#B0306A', darkBg: '#3D0A1F', darkText: '#F48FB1', label: 'Noun (die)' },
  neut:  { bg: '#E8F5E9', text: '#2E7D32', darkBg: '#0A2E0E', darkText: '#81C784', label: 'Noun (das)' },
  pron:  { bg: '#F5F5F5', text: '#555555', darkBg: '#2A2A2A', darkText: '#AAAAAA', label: 'Pronoun' },
}

type TooltipPos = { x: number; y: number }

export function GermanWord({ data }: { data: AnnotatedWord }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState<TooltipPos>({ x: 0, y: 0 })
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const style = TYPE_STYLES[data.type] ?? TYPE_STYLES.adv

  const place = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    let x: number, y: number
    if ('touches' in e) {
      x = e.touches[0].clientX
      y = e.touches[0].clientY
    } else {
      x = (e as React.MouseEvent).clientX
      y = (e as React.MouseEvent).clientY
    }
    const tw = 220
    const th = 140
    const vw = window.innerWidth
    const vh = window.innerHeight
    let left = x + 14
    let top = y - 70
    if (left + tw > vw - 8) left = x - tw - 14
    if (top + th > vh - 8) top = vh - th - 8
    if (top < 8) top = 8
    setPos({ x: left, y: top })
  }, [])

  const show = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      place(e)
      setVisible(true)
    },
    [place]
  )

  const hide = useCallback((delay = 200) => {
    hideTimer.current = setTimeout(() => setVisible(false), delay)
  }, [])

  return (
    <>
      <span
        className="rounded-sm px-[2px] font-medium cursor-pointer transition-opacity hover:opacity-75"
        style={{
          backgroundColor: style.bg,
          color: style.text,
        }}
        onMouseEnter={show}
        onMouseMove={place}
        onMouseLeave={() => hide(200)}
        onTouchStart={(e) => { e.preventDefault(); show(e) }}
        onTouchEnd={() => hide(2500)}
      >
        {data.word}
      </span>

      {visible && (
        <div
          className="fixed z-50 w-[220px] rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 shadow-lg pointer-events-none"
          style={{ left: pos.x, top: pos.y }}
        >
          <div className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5">
            {data.word}
          </div>
          <div className="text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
            {style.label}
          </div>
          <div className="text-[13px] text-neutral-600 dark:text-neutral-300 mb-2">
            {data.translation}
          </div>
          <div className="text-[12px] text-neutral-500 dark:text-neutral-400 italic border-l-2 border-neutral-200 dark:border-neutral-700 pl-2 leading-relaxed">
            {data.example}
          </div>
        </div>
      )}
    </>
  )
}
