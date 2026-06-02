'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLastChapter } from '@/lib/storage'
import type { ChapterMeta } from '@/lib/getChapters'

type Props = {
  novelId: string
  chapters: ChapterMeta[]
}

export function NovelPageClient({ novelId, chapters }: Props) {
  const [lastChapter, setLastChapter] = useState<number | null>(null)

  useEffect(() => {
    const ch = getLastChapter(novelId)
    setLastChapter(ch)
  }, [novelId])

  if (chapters.length === 0) return null

  const firstChapter = chapters[0].id
  const isStarted = lastChapter !== null && lastChapter > 1

  return (
    <div className="flex gap-2 mb-6">
      {isStarted ? (
        <>
          <Link
            href={`/${novelId}/${lastChapter}`}
            className="flex-1 py-2.5 text-center text-[13px] font-medium border border-neutral-800 dark:border-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg hover:bg-neutral-800 hover:text-white dark:hover:bg-neutral-200 dark:hover:text-neutral-900 transition-colors"
          >
            Continue Ch. {lastChapter}
          </Link>
          <Link
            href={`/${novelId}/${firstChapter}`}
            className="px-4 py-2.5 text-center text-[13px] border border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            From start
          </Link>
        </>
      ) : (
        <Link
          href={`/${novelId}/${firstChapter}`}
          className="flex-1 py-2.5 text-center text-[13px] font-medium border border-neutral-800 dark:border-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg hover:bg-neutral-800 hover:text-white dark:hover:bg-neutral-200 dark:hover:text-neutral-900 transition-colors"
        >
          Start reading
        </Link>
      )}
    </div>
  )
}
