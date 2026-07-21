'use client'
import { useEffect, useCallback, useRef } from 'react'
import { useWordBookmark } from './WordBookmarkContext'
import { useWordNarration } from './WordNarrationContext'
import type { NarrationLang } from '@/lib/tts'

// Wraps rendered chapter content to (1) delegate clicks on any
// [data-word-index] element to the bookmark context while select mode is
// active, and (2) scroll to the bookmarked item if it lives in this chapter
// and the URL says to (#bookmark). Works for word-level bookmarks
// (annotated/plain novels, graded novels) and paragraph-level bookmarks
// (parallel novels) alike, since both just need a [data-word-index] +
// [data-word-text] pair on the element that should become bookmarkable.
//
// The amber highlight itself is NOT applied here. It used to be added
// imperatively via classList, but that only ever added the class and never
// removed it from the previously-bookmarked element, so old highlights kept
// piling up. It also didn't survive elements being unmounted/remounted
// (e.g. a parallel paragraph flipping between DE/EN). Each renderer now
// applies `word-bookmarked` itself, driven by React state, so it's always
// in sync with exactly one element.
export function ChapterBookmarkLayer({
  novelId, novelTitle, chapterNum, children,
}: {
  novelId: string
  novelTitle: string
  chapterNum: number
  children: React.ReactNode
}) {
  const { active, selectWord, bookmark } = useWordBookmark()
  const { active: narrateActive, speakWord } = useWordNarration()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!active && !narrateActive) return
    const target = (e.target as HTMLElement).closest('[data-word-index]') as HTMLElement | null
    if (!target) return

    if (narrateActive) {
      const narrateText = target.dataset.narrateText ?? target.dataset.wordText ?? ''
      const lang = (target.dataset.wordLang as NarrationLang) ?? 'en-GB'
      speakWord(narrateText, lang)
      return
    }

    const wordIndex = Number(target.dataset.wordIndex)
    const wordText = target.dataset.wordText ?? ''
    if (Number.isNaN(wordIndex)) return
    selectWord({ wordIndex, wordText, novelId, novelTitle, chapter: chapterNum })
  }, [active, narrateActive, selectWord, speakWord, novelId, novelTitle, chapterNum])

  useEffect(() => {
    if (!bookmark || bookmark.novelId !== novelId || bookmark.chapter !== chapterNum) return
    if (window.location.hash !== '#bookmark') return
    const el = containerRef.current?.querySelector(`[data-word-index="${bookmark.wordIndex}"]`)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [bookmark, novelId, chapterNum])

  return (
    <div ref={containerRef} onClick={handleClick} className={active || narrateActive ? 'word-select-mode' : undefined}>
      {children}
    </div>
  )
}
