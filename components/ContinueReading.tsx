'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLastChapter, getLastUpdated } from '@/lib/storage'
import { IconArrowRight } from '@tabler/icons-react'
import type { Novel } from '@/novels.config'

const EXCLUDED_IDS = ['ugly-duckling', 'a1-glossary']

export function ContinueReading({ novels }: { novels: Novel[] }) {
  const pathname = usePathname()
  const [entries, setEntries] = useState<{ novel: Novel; chapter: number }[]>([])

  useEffect(() => {
    const mostRecent = novels
      .filter(n => !EXCLUDED_IDS.includes(n.id))
      .map(n => ({ novel: n, chapter: getLastChapter(n.id), updated: getLastUpdated(n.id) }))
      .filter(e => e.chapter > 1)
      .sort((a, b) => b.updated - a.updated)
      .slice(0, 1)
      .map(({ novel, chapter }) => ({ novel, chapter }))

    setEntries(mostRecent)
  }, [novels, pathname])

  if (!entries.length) return null
  return (
    <section className="mb-8">
      <div className="text-[0.625rem] uppercase tracking-[0.12em] text-neutral-400 mb-2 px-1">Continue Reading</div>
      {entries.map(({ novel, chapter }) => (
        <Link key={novel.id} href={`/${novel.id}/${chapter}`}
          className="flex items-center gap-3 p-3 border border-neutral-600 rounded-xl hover:bg-neutral-600 transition-colors group mb-2"
        >
          <div className="w-8 h-10 bg-neutral-600 rounded flex items-center justify-center flex-shrink-0 text-neutral-300 text-[0.625rem] font-bold">
            {novel.title.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-neutral-100 truncate">{novel.title}</div>
            <div className="text-[0.6875rem] text-neutral-400 mt-0.5">Chapter {chapter}</div>
          </div>
          <IconArrowRight size={14} className="text-neutral-400 group-hover:text-neutral-200 transition-colors flex-shrink-0" />
        </Link>
      ))}
    </section>
  )
}