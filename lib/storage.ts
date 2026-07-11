'use client'

const PREFIX = 'schatten-lesen'

// Novels that should never have reading progress recorded (demo/reference content).
const PROGRESS_EXCLUDED_IDS = ['ugly-duckling', 'a1-glossary']

export function getLastChapter(novelId: string): number {
  if (typeof window === 'undefined') return 1
  const val = localStorage.getItem(`${PREFIX}:progress:${novelId}`)
  return val ? parseInt(val, 10) : 1
}

export function setLastChapter(novelId: string, chapter: number): void {
  if (typeof window === 'undefined') return
  if (PROGRESS_EXCLUDED_IDS.includes(novelId)) return
  localStorage.setItem(`${PREFIX}:progress:${novelId}`, String(chapter))
  localStorage.setItem(`${PREFIX}:updated:${novelId}`, String(Date.now()))
}

export function getLastUpdated(novelId: string): number {
  if (typeof window === 'undefined') return 0
  const val = localStorage.getItem(`${PREFIX}:updated:${novelId}`)
  return val ? parseInt(val, 10) : 0
}

// A single, app-wide bookmark pointing at one exact word in one exact chapter.
// Picking a new word always replaces whatever was bookmarked before — there's
// only ever one of these at a time. `wordIndex` is the word's sequential
// position within the chapter's rendered token stream (see ChapterRenderer),
// which is what lets us find and highlight the exact same word again later,
// even for plain, un-annotated text where many words share the same text.
export type WordBookmark = {
  novelId: string
  novelTitle: string
  chapter: number
  wordIndex: number
  wordText: string
  savedAt: number
}

export function getWordBookmark(): WordBookmark | null {
  if (typeof window === 'undefined') return null
  const val = localStorage.getItem(`${PREFIX}:wordBookmark`)
  return val ? (JSON.parse(val) as WordBookmark) : null
}

export function setWordBookmark(bookmark: WordBookmark): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${PREFIX}:wordBookmark`, JSON.stringify(bookmark))
}

export function clearWordBookmark(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(`${PREFIX}:wordBookmark`)
}
