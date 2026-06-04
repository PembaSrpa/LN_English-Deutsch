'use client'
import { useState, useRef, useCallback } from 'react'
import type { AnnotatedWord, WordType } from '@/lib/parseChapter'

const TYPE_STYLES: Record<WordType, { light: string; dark: string; label: string }> = {
  verb:  { light: '#b45309', dark: '#fcd34d', label: 'Verb' },        // amber
  conj:  { light: '#92400e', dark: '#fbbf24', label: 'Conjunction' }, // brown
  adv:   { light: '#0e7490', dark: '#67e8f9', label: 'Adverb' },      // cyan
  adj:   { light: '#7c3aed', dark: '#d8b4fe', label: 'Adjective' },   // violet
  masc:  { light: '#1d4ed8', dark: '#60a5fa', label: 'Noun (der)' },  // blue
  fem:   { light: '#c2003f', dark: '#ff6b9d', label: 'Noun (die)' },  // crimson
  neut:  { light: '#047857', dark: '#34d399', label: 'Noun (das)' },  // teal-green
  pron:  { light: '#6b7280', dark: '#d1d5db', label: 'Pronoun' },     // gray
}

export function GermanWord({ data }: { data: AnnotatedWord }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const spanRef = useRef<HTMLSpanElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const style = TYPE_STYLES[data.type] ?? TYPE_STYLES.adv

  const computePos = useCallback(() => {
    if (!spanRef.current) return
    const rect = spanRef.current.getBoundingClientRect()
    const tw = 240, th = 160, pad = 8
    const vw = window.innerWidth, vh = window.innerHeight
    let x = rect.left
    if (x + tw > vw - pad) x = vw - tw - pad
    if (x < pad) x = pad
    const y = (vh - rect.bottom - pad) >= th ? rect.bottom + 4 : rect.top - th - 4
    setPos({ x, y })
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
        className="font-semibold cursor-pointer hover:opacity-70 transition-opacity"
        style={{ color: style.light }}
        onMouseEnter={show}
        onMouseLeave={() => hide(150)}
        onTouchStart={(e) => { e.preventDefault(); show() }}
        onTouchEnd={() => hide(2500)}
      >
        <style>{`.dark .de-${data.type}{color:${style.dark}!important}`}</style>
        <span className={`de-${data.type}`} style={{ color: 'inherit' }}>{data.word}</span>
      </span>

      {visible && (
        <div
          className="fixed z-[200] w-[240px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-3 pointer-events-none"
          style={{ left: pos.x, top: pos.y, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
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
