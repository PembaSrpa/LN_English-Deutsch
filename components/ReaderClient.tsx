'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChapterRenderer } from './ChapterRenderer'
import { BookmarkButton } from './BookmarkButton'
import { FontSizeButton } from './FontSizeButton'
import { ProgressTracker } from './ProgressTracker'
import { TutorialHint } from './TutorialHint'
import { ThemeToggle } from './ThemeToggle'
import { IconArrowLeft, IconArrowRight, IconLanguage, IconBookmark, IconLetterA } from '@tabler/icons-react'
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
  const [fontSize, setFontSize] = useState(15)
  const prevNum = chapterNum > 1 ? chapterNum - 1 : null
  const nextNum = chapterNum < availableChapters ? chapterNum + 1 : null

  return (
    <div className="min-h-screen flex flex-col bg-neutral-200 dark:bg-neutral-900">
      <ProgressTracker novelId={novelId} chapter={chapterNum} />

      {/* sticky top navbar */}
      <header className="sticky top-0 z-40 bg-neutral-200/90 dark:bg-neutral-900/90 backdrop-blur border-b border-neutral-300 dark:border-neutral-700">
        <div className="flex items-center justify-between px-8 py-2">
          <Link href={`/${novelId}`} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
            <IconArrowLeft size={14} />
            <span className="truncate max-w-[140px]">{novelTitle}</span>
          </Link>
          <div className="flex items-center gap-1">
            <FontSizeButton onChange={setFontSize} />
            <BookmarkButton novelId={novelId} chapter={chapterNum} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* scrollable content */}
      <main className="flex-1 px-8 py-8 overflow-y-auto pb-4">
        {isDemo && chapterNum === 1 && (
          <>
            <TutorialHint id="reader-german-word" icon={<IconLanguage size={14} />} title="Tap coloured words" body="Each highlighted word is German. Tap or hover to see translation and example." />
            <TutorialHint id="reader-bookmark" icon={<IconBookmark size={14} />} title="Bookmark chapters" body="Save your place with the bookmark icon. Stored locally, no account needed." />
            <TutorialHint id="reader-font" icon={<IconLetterA size={14} />} title="Adjust font size" body="Cycle S/M/L with the font button in the top bar." />
          </>
        )}
        <ChapterRenderer lines={lines} fontSize={fontSize} />
      </main>

      {/* sticky bottom nav */}
      <nav className="sticky bottom-0 z-40 bg-neutral-200/90 dark:bg-neutral-900/90 backdrop-blur border-t border-neutral-300 dark:border-neutral-700">
        <div className="flex items-center justify-between px-8 py-3">
          {prevNum ? (
            <Link href={`/${novelId}/${prevNum}`} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
              <IconArrowLeft size={13} /> Prev
            </Link>
          ) : <span />}
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 tabular-nums">{chapterNum} / {totalChapters}</span>
          {nextNum ? (
            <Link href={`/${novelId}/${nextNum}`} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
              Next <IconArrowRight size={13} />
            </Link>
          ) : <span />}
        </div>
      </nav>
    </div>
  )
}
