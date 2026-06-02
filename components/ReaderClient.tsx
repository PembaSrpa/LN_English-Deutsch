'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChapterRenderer } from './ChapterRenderer'
import { BookmarkButton } from './BookmarkButton'
import { FontSizeButton } from './FontSizeButton'
import { ProgressTracker } from './ProgressTracker'
import { TutorialHint } from './TutorialHint'
import type { ParsedLine } from '@/lib/parseChapter'

type Props = {
  novelId: string
  novelTitle: string
  chapterNum: number
  totalChapters: number
  availableChapters: number
  lines: ParsedLine[]
  isDemo?: boolean
}

export function ReaderClient({ novelId, novelTitle, chapterNum, totalChapters, availableChapters, lines, isDemo }: Props) {
  const [fontSize, setFontSize] = useState(16)

  const prevNum = chapterNum > 1 ? chapterNum - 1 : null
  const nextNum = chapterNum < availableChapters ? chapterNum + 1 : null

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <ProgressTracker novelId={novelId} chapter={chapterNum} />

      <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-5 py-2.5 max-w-2xl mx-auto">
          <Link
            href={`/${novelId}`}
            className="flex items-center gap-1.5 text-[12px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {novelTitle}
          </Link>
          <div className="flex items-center gap-2">
            <FontSizeButton onChange={setFontSize} />
            <BookmarkButton novelId={novelId} chapter={chapterNum} />
          </div>
        </div>
      </header>

      <main className="px-5 py-8 max-w-2xl mx-auto">
        {isDemo && chapterNum === 1 && (
          <TutorialHint
            id="reader-german-word"
            icon="🇩🇪"
            title="Hover the coloured words"
            body="Every highlighted word is a German word embedded in the English text. Tap or hover it to see the translation, word type, and an example sentence. Colours tell you the type: blue = masculine noun, pink = feminine, green = neuter, orange = verb, and so on."
          />
        )}

        {isDemo && chapterNum === 1 && (
          <TutorialHint
            id="reader-bookmark"
            icon="🔖"
            title="Bookmark any chapter"
            body="Tap the bookmark icon in the top-right to save your place. Bookmarked chapters appear in your library. Everything is stored locally — no account needed."
          />
        )}

        {isDemo && chapterNum === 1 && (
          <TutorialHint
            id="reader-font"
            icon="Aa"
            title="Adjust the font size"
            body="Tap the S/M/L button at the top to cycle through three font sizes. Your preference is applied immediately."
          />
        )}

        <ChapterRenderer lines={lines} fontSize={fontSize} />
      </main>

      <nav className="border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 max-w-2xl mx-auto flex items-center justify-between text-[13px] text-neutral-500">
        {prevNum ? (
          <Link
            href={`/${novelId}/${prevNum}`}
            className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Previous
          </Link>
        ) : (
          <span />
        )}
        <span className="text-neutral-400 dark:text-neutral-600 text-[12px]">
          {chapterNum} / {totalChapters}
        </span>
        {nextNum ? (
          <Link
            href={`/${novelId}/${nextNum}`}
            className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
