'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLastChapter, getBookmarks } from '@/lib/storage'
import type { Novel } from '@/novels.config'

export function ContinueReading({ novels }: { novels: Novel[] }) {
  const [entries, setEntries] = useState<{ novel: Novel; chapter: number }[]>([])

  useEffect(() => {
    const result = novels
      .map((n) => ({ novel: n, chapter: getLastChapter(n.id) }))
      .filter((e) => e.chapter > 1 || getBookmarks(e.novel.id).length > 0)
    setEntries(result)
  }, [novels])

  if (entries.length === 0) return null

  return (
    <section className="mb-10">
      <h2 className="text-[11px] uppercase tracking-[0.1em] text-neutral-400 dark:text-neutral-500 mb-3">
        Continue Reading
      </h2>
      <div className="flex flex-col gap-2">
        {entries.map(({ novel, chapter }) => (
          <Link
            key={novel.id}
            href={`/${novel.id}/${chapter}`}
            className="flex items-center gap-4 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group"
          >
            <div className="w-9 h-12 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 truncate">
                {novel.title}
              </div>
              <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                Chapter {chapter}
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 transition-colors flex-shrink-0">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  )
}
