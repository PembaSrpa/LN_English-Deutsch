'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSavedWords, removeSavedWord, type SavedWord } from '@/lib/storage'
import { IconBookmarkFilled, IconTrash } from '@tabler/icons-react'

const TYPE_COLORS: Record<string, string> = {
  verb: '#fcd34d',
  conj: '#c084fc',
  adv: '#c084fc',
  adj: '#c084fc',
  masc: '#60a5fa',
  fem: '#f472b6',
  neut: '#4ade80',
  pron: '#c084fc',
}

export function VocabClient() {
  const [words, setWords] = useState<SavedWord[]>([])

  useEffect(() => {
    setWords(getSavedWords().sort((a, b) => b.savedAt - a.savedAt))
  }, [])

  const handleRemove = (w: SavedWord) => {
    removeSavedWord(w.novelId, w.chapter, w.word)
    setWords((prev) => prev.filter((x) => x.id !== w.id))
  }

  if (!words.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 text-neutral-400">
        <IconBookmarkFilled size={28} className="mb-3 text-neutral-500" />
        <p className="text-sm font-semibold text-neutral-200 mb-1">No saved words yet</p>
        <p className="text-xs max-w-[240px]">Tap the bookmark icon on any highlighted word while reading to save it here.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {words.map((w) => (
        <div key={w.id} className="flex items-start gap-3 p-3 border border-neutral-600 rounded-xl bg-neutral-700">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-bold" style={{ color: TYPE_COLORS[w.type] ?? '#c084fc' }}>{w.word}</span>
            </div>
            <p className="text-xs text-neutral-300 mb-1">{w.translation}</p>
            {w.example ? (
              <p className="text-[0.6875rem] text-neutral-400 italic border-l-2 border-neutral-600 pl-2 leading-relaxed mb-1.5">
                {w.example.replace(/\s*—\s*/g, ' - ')}
              </p>
            ) : null}
            <Link
              href={`/${w.novelId}/${w.chapter}`}
              className="text-[0.625rem] text-neutral-400 hover:text-neutral-200 transition-colors underline underline-offset-2"
            >
              {w.novelTitle} · Ch. {w.chapter}
            </Link>
          </div>
          <button
            onClick={() => handleRemove(w)}
            aria-label="Remove saved word"
            className="flex-shrink-0 p-2 hover:bg-neutral-600 rounded-md transition-colors"
          >
            <IconTrash size={15} className="text-neutral-400" />
          </button>
        </div>
      ))}
    </div>
  )
}
