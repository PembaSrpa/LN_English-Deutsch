'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSettings } from './SettingsContext'
import { useWordBookmark } from './WordBookmarkContext'
import type { ParagraphPair } from '@/lib/parseParallelChapter'

type Props = {
  data: ParagraphPair
  // Stable per-chapter paragraph index, used as the bookmark "word" index
  // since parallel novels bookmark whole paragraphs rather than words.
  wordIndex: number
  novelId: string
  chapterNum: number
}

function snippet(text: string): string {
  const trimmed = text.trim()
  return trimmed.length > 60 ? `${trimmed.slice(0, 60).trim()}…` : trimmed
}

const WARP_TRANSITION = { duration: 0.5, ease: 'easeInOut' as const }

const EXIT_WARP = {
  skewX: [0, 5, -4, 3, -2, 0],
  scaleX: [1, 1.03, 0.98, 1.015, 0.99, 1],
  scaleY: [1, 0.97, 1.03, 0.98, 1.01, 1],
  filter: ['blur(0px)', 'blur(2px)', 'blur(0px)', 'blur(2px)', 'blur(0px)', 'blur(3px)'],
  opacity: [1, 0.9, 1, 0.9, 1, 0],
}

const ENTER_WARP = {
  skewX: [6, -5, 3, -1.5, 0],
  scaleX: [0.96, 1.04, 0.98, 1.01, 1],
  scaleY: [1.04, 0.96, 1.02, 0.99, 1],
  filter: ['blur(3px)', 'blur(1px)', 'blur(2px)', 'blur(0.5px)', 'blur(0px)'],
  opacity: [0, 1, 0.85, 1, 1],
}

export function ParallelParagraph({ data, wordIndex, novelId, chapterNum }: Props) {
  const { languageMode } = useSettings()
  const { active: selectActive, bookmark } = useWordBookmark()
  const [revealed, setRevealed] = useState(false)

  const wordText = snippet(data.german || data.english)
  const isBookmarked = !!bookmark
    && bookmark.novelId === novelId
    && bookmark.chapter === chapterNum
    && bookmark.wordIndex === wordIndex

  if (languageMode === 'en') {
    return (
      <p
        data-word-index={wordIndex}
        data-word-text={wordText}
        className={`leading-[1.95] mb-4 text-[1em] text-neutral-200 ${isBookmarked ? 'word-bookmarked' : ''}`}
      >
        {data.english}
      </p>
    )
  }

  if (languageMode === 'de') {
    return (
      <p
        data-word-index={wordIndex}
        data-word-text={wordText}
        className={`leading-[1.95] mb-4 text-[1em] text-neutral-200 ${isBookmarked ? 'word-bookmarked' : ''}`}
      >
        {data.german}
      </p>
    )
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.p
        key={revealed ? 'en' : 'de'}
        data-word-index={wordIndex}
        data-word-text={wordText}
        onClick={() => { if (!selectActive) setRevealed((v) => !v) }}
        exit={EXIT_WARP}
        animate={ENTER_WARP}
        transition={WARP_TRANSITION}
        className={`leading-[1.95] mb-4 text-[1em] cursor-pointer touch-manipulation ${revealed ? 'text-neutral-400' : 'text-neutral-200'} ${isBookmarked ? 'word-bookmarked' : ''}`}
      >
        {revealed ? data.english : data.german}
      </motion.p>
    </AnimatePresence>
  )
}
