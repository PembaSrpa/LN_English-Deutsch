'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { isWordSaved } from '@/lib/storage'
import { IconBookmarkFilled } from '@tabler/icons-react'
import { useClipMode } from './ClipModeContext'
import type { AnnotatedWord, WordType } from '@/lib/parseChapter'

const TYPE_STYLES: Record<WordType, { color: string; label: string }> = {
  verb:  { color: '#fcd34d', label: 'Verb' },
  conj:  { color: '#c084fc', label: 'Conjunction' },
  adv:   { color: '#c084fc', label: 'Adverb' },
  adj:   { color: '#c084fc', label: 'Adjective' },
  masc:  { color: '#60a5fa', label: 'Noun (der)' },
  fem:   { color: '#f472b6', label: 'Noun (die)' },
  neut:  { color: '#4ade80', label: 'Noun (das)' },
  pron:  { color: '#c084fc', label: 'Pronoun' },
}

type Props = {
  data: AnnotatedWord
  novelId: string
  novelTitle: string
  chapter: number
}

export function GermanWord({ data, novelId, novelTitle, chapter }: Props) {
  const { active: clipActive, clipWord } = useClipMode()
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)
  const [justClipped, setJustClipped] = useState(false)
  const spanRef = useRef<HTMLSpanElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    setSaved(isWordSaved(novelId, chapter, data.word))
  }, [novelId, chapter, data.word])

  useEffect(() => {
    if (!isTouch || !visible) return
    const dismiss = () => setVisible(false)
    dismissTimer.current = setTimeout(() => {
      document.addEventListener('touchstart', dismiss, { passive: true })
    }, 50)
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
      document.removeEventListener('touchstart', dismiss)
    }
  }, [isTouch, visible])

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

  const handleClip = useCallback(() => {
    const nowSaved = clipWord({
      word: data.word,
      type: data.type,
      translation: data.translation,
      example: data.example,
      novelId,
      novelTitle,
      chapter,
    })
    setSaved(nowSaved)
    setJustClipped(true)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setJustClipped(false), 500)
  }, [data, novelId, novelTitle, chapter, clipWord])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    if (clipActive) {
      handleClip()
      return
    }
    if (visible) {
      setVisible(false)
    } else {
      show()
    }
  }, [visible, show, clipActive, handleClip])

  const handleClick = useCallback(() => {
    if (clipActive) handleClip()
  }, [clipActive, handleClip])

  const touchHandlers = isTouch
    ? { onTouchStart: handleTouchStart }
    : {
        onMouseEnter: () => { if (!clipActive) show() },
        onMouseLeave: () => hide(150),
        onClick: handleClick,
      }

  const popup = mounted && visible && !clipActive ? createPortal(
    <div
      className="fixed z-[200] w-[240px] rounded-xl border border-neutral-600 bg-neutral-800 p-3"
      style={{ left: pos.x, top: pos.y, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
      onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current) }}
      onMouseLeave={() => hide(150)}
    >
      <div className="flex items-start justify-between gap-2 mb-0.5">
        <p className="text-sm font-bold text-neutral-100">{data.word}</p>
        {saved && <IconBookmarkFilled size={14} className="flex-shrink-0 text-amber-400 -mt-0.5 -mr-0.5" />}
      </div>
      <p className="text-[0.625rem] uppercase tracking-widest text-neutral-400 mb-1.5">{style.label}</p>
      <p className="text-xs text-neutral-300 mb-2">{data.translation}</p>
      {data.example ? (
        <p className="text-[0.6875rem] text-neutral-400 italic border-l-2 border-neutral-600 pl-2 leading-relaxed">
          {data.example.replace(/\s*—\s*/g, ' - ')}
        </p>
      ) : null}
    </div>,
    document.body
  ) : null

  return (
    <>
      <span
        ref={spanRef}
        className={`font-semibold transition-all rounded ${clipActive ? 'cursor-pointer' : 'cursor-pointer hover:opacity-70'} ${
          justClipped ? 'ring-2 ring-amber-400' : ''
        }`}
        style={{ color: style.color }}
        {...touchHandlers}
      >
        {data.word}
        {saved && <IconBookmarkFilled size={9} className="inline-block ml-0.5 mb-1.5 text-amber-400" />}
      </span>
      {popup}
    </>
  )
}
