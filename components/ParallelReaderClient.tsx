'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ParallelChapterRenderer } from './ParallelChapterRenderer'
import { WordBookmarkToggle } from './WordBookmarkToggle'
import { ChapterBookmarkLayer } from './ChapterBookmarkLayer'
import { WordBookmarkProvider } from './WordBookmarkContext'
import { SettingsPanel } from './SettingsPanel'
import { ProgressTracker } from './ProgressTracker'
import { useSettings } from './SettingsContext'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { FONT_STACKS } from '@/lib/settings'
import type { ParsedParallelLine } from '@/lib/parseParallelChapter'

type Props = {
  novelId: string
  novelTitle: string
  chapterNum: number
  availableChapters: number
  lines: ParsedParallelLine[]
}

export function ParallelReaderClient({ novelId, novelTitle, chapterNum, availableChapters, lines }: Props) {
  const { fontSize, fontFamily } = useSettings()

  const prevNum = chapterNum > 1 ? chapterNum - 1 : null
  const nextNum = chapterNum < availableChapters ? chapterNum + 1 : null

  return (
    <WordBookmarkProvider resetKey={chapterNum}>
      <div className="min-h-screen flex flex-col">
        <ProgressTracker novelId={novelId} chapter={chapterNum} />

        <header className="sticky top-0 z-40 bg-neutral-750 border-b border-neutral-600">
          <div className="flex items-center justify-between gap-2 px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-2">
            <motion.div className="min-w-0 flex-1" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Link href={`/${novelId}`} title={novelTitle} className="flex items-center gap-1.5 min-w-0 text-xs text-neutral-100 font-medium hover:text-[var(--n-emphasis)] transition-colors">
                <IconArrowLeft size={14} className="shrink-0" />
                <span className="truncate">{novelTitle}</span>
              </Link>
            </motion.div>
            <div className="flex items-center gap-1 shrink-0">
              <WordBookmarkToggle novelId={novelId} chapter={chapterNum} />
              <SettingsPanel showLanguageMode />
            </div>
          </div>
        </header>

        <main className="flex-1 px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-8">
          <div className="max-w-3xl mx-auto">
            <ChapterBookmarkLayer novelId={novelId} novelTitle={novelTitle} chapterNum={chapterNum}>
              <ParallelChapterRenderer lines={lines} fontSize={fontSize} fontFamily={FONT_STACKS[fontFamily]} novelId={novelId} chapterNum={chapterNum} />
            </ChapterBookmarkLayer>
          </div>
        </main>

        <nav className="sticky bottom-0 z-40 bg-neutral-750 border-t border-neutral-600">
          <div className="flex items-center justify-between px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-3">
            {prevNum ? (
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <Link href={`/${novelId}/${prevNum}`} className="flex items-center gap-1.5 text-xs text-neutral-100 font-medium hover:text-[var(--n-emphasis)] transition-colors">
                  <IconArrowLeft size={13} /> Prev
                </Link>
              </motion.div>
            ) : <span />}
            <span className="text-[0.6875rem] text-neutral-400 tabular-nums">Ch. {chapterNum}</span>
            {nextNum ? (
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <Link href={`/${novelId}/${nextNum}`} className="flex items-center gap-1.5 text-xs text-neutral-100 font-medium hover:text-[var(--n-emphasis)] transition-colors">
                  Next <IconArrowRight size={13} />
                </Link>
              </motion.div>
            ) : <span />}
          </div>
        </nav>
      </div>
    </WordBookmarkProvider>
  )
}