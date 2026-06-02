'use client'

import { useState, useEffect } from 'react'
import { isBookmarked, toggleBookmark } from '@/lib/storage'

export function BookmarkButton({ novelId, chapter }: { novelId: string; chapter: number }) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    setBookmarked(isBookmarked(novelId, chapter))
  }, [novelId, chapter])

  function handleClick() {
    const next = toggleBookmark(novelId, chapter)
    setBookmarked(next)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this chapter'}
      className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  )
}
