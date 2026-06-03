'use client'
import { useState, useEffect } from 'react'
import { isBookmarked, toggleBookmark } from '@/lib/storage'
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'

export function BookmarkButton({ novelId, chapter }: { novelId: string; chapter: number }) {
  const [bookmarked, setBookmarked] = useState(false)
  useEffect(() => { setBookmarked(isBookmarked(novelId, chapter)) }, [novelId, chapter])
  return (
    <button
      onClick={() => setBookmarked(toggleBookmark(novelId, chapter))}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
      className="py-2 px-3 hover:bg-neutral-300 dark:hover:bg-neutral-800 rounded-md transition-colors border border-transparent hover:border-neutral-400 dark:hover:border-neutral-600"
    >
      {bookmarked
        ? <IconBookmarkFilled size={16} className="text-neutral-700 dark:text-neutral-300" />
        : <IconBookmark size={16} className="text-neutral-500 dark:text-neutral-400" />}
    </button>
  )
}
