'use client'
import { useEffect, useCallback, useRef } from 'react'
import { useWordBookmark } from './WordBookmarkContext'

// Wraps rendered chapter content to (1) delegate clicks on any
// [data-word-index] element to the bookmark context while select mode is
// active, and (2) highlight + scroll to the bookmarked item if it lives in
// this chapter. Works for word-level bookmarks (annotated/plain novels,
// graded novels) and paragraph-level bookmarks (parallel novels) alike,
// since both just need a [data-word-index] + [data-word-text] pair on the
// element that should become bookmarkable.
export function ChapterBookmarkLayer({
  novelId, novelTitle, chapterNum, children,
}: {
  novelId: string
  novelTitle: string
  chapterNum: number
  children: React.ReactNode
}) {
  const { active, selectWord, bookmark } = useWordBookmark()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return
    const target = (e.target as HTMLElement).closest('[data-word-index]') as HTMLElement | null
    if (!target) return
    const wordIndex = Number(target.dataset.wordIndex)
    const wordText = target.dataset.wordText ?? ''
    if (Number.isNaN(wordIndex)) return
    selectWord({ wordIndex, wordText, novelId, novelTitle, chapter: chapterNum })
  }, [active, selectWord, novelId, novelTitle, chapterNum])

  useEffect(() => {
    if (!bookmark || bookmark.novelId !== novelId || bookmark.chapter !== chapterNum) return
    const el = containerRef.current?.querySelector(`[data-word-index="${bookmark.wordIndex}"]`)
    if (!el) return
    el.classList.add('word-bookmarked')
    if (window.location.hash === '#bookmark') {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [bookmark, novelId, chapterNum])

  return (
    <div ref={containerRef} onClick={handleClick} className={active ? 'word-select-mode' : undefined}>
      {children}
    </div>
  )
}
