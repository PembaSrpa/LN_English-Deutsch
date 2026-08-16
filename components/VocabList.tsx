'use client'
import { useState } from 'react'
import type { VocabEntry } from '@/lib/parseGradedChapter'

export function VocabList({ entries }: { entries: VocabEntry[] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  if (entries.length === 0) return null

  const toggle = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div className="mt-10 mb-10">
      <div className="text-[0.625rem] uppercase tracking-widest text-neutral-400 mb-3">Vokabeln</div>
      <div className="flex flex-wrap gap-2">
        {entries.map((entry, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="text-left px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-650 transition-colors touch-manipulation text-sm"
          >
            <span className="text-neutral-100 font-medium">{entry.term}</span>
            {revealed.has(i) && <span className="text-neutral-400"> — {entry.meaning}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
