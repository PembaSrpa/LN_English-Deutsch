'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChapterRenderer } from './ChapterRenderer'
import { BookmarkButton } from './BookmarkButton'
import { ProgressTracker } from './ProgressTracker'
import { ThemeToggle } from './ThemeToggle'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
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

export function ReaderClient({ novelId, novelTitle, chapterNum, totalChapters, availableChapters, lines }: Props) {
  const [fontSize, setFontSize] = useState(15)
  useEffect(() => { setFontSize(window.innerWidth < 768 ? 13 : 15) }, [])

  const prevNum = chapterNum > 1 ? chapterNum - 1 : null
  const nextNum = chapterNum < availableChapters ? chapterNum + 1 : null

  return (
    <div className="min-h-screen flex flex-col">
      <ProgressTracker novelId={novelId} chapter={chapterNum} />

      <header className="sticky top-0 z-40 bg-neutral-400 dark:bg-neutral-700 backdrop-blur border-b border-neutral-300 dark:border-neutral-700">
        <div className="flex items-center justify-between px-8 py-2">
          <Link href={`/${novelId}`} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
            <IconArrowLeft size={14} />
            <span className="truncate max-w-[160px]">{novelTitle}</span>
          </Link>
          <div className="flex items-center gap-1">
            <BookmarkButton novelId={novelId} chapter={chapterNum} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 px-8 py-8">
        <ChapterRenderer lines={lines} fontSize={fontSize} />
      </main>

      <nav className="sticky bottom-0 z-40 bg-neutral-400 dark:bg-neutral-700 backdrop-blur border-t border-neutral-300 dark:border-neutral-700">
        <div className="flex items-center justify-between px-8 py-3">
          {prevNum
            ? <Link href={`/${novelId}/${prevNum}`} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"><IconArrowLeft size={13} /> Prev</Link>
            : <span />}
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 tabular-nums">{chapterNum} / {totalChapters}</span>
          {nextNum
            ? <Link href={`/${novelId}/${nextNum}`} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">Next <IconArrowRight size={13} /></Link>
            : <span />}
        </div>
      </nav>
    </div>
  )
}
