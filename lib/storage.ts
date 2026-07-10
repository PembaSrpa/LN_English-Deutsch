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

export function getBookmarks(novelId: string): number[] {
  if (typeof window === 'undefined') return []
  const val = localStorage.getItem(`${PREFIX}:bookmarks:${novelId}`)
  return val ? (JSON.parse(val) as number[]) : []
}

export function toggleBookmark(novelId: string, chapter: number): boolean {
  const current = getBookmarks(novelId)
  const exists = current.includes(chapter)
  const updated = exists ? current.filter((c) => c !== chapter) : [...current, chapter]
  localStorage.setItem(`${PREFIX}:bookmarks:${novelId}`, JSON.stringify(updated))
  return !exists
}

export function isBookmarked(novelId: string, chapter: number): boolean {
  return getBookmarks(novelId).includes(chapter)
}

export type SavedWord = {
  id: string
  word: string
  type: string
  translation: string
  example: string
  novelId: string
  novelTitle: string
  chapter: number
  savedAt: number
}

function wordId(novelId: string, chapter: number, word: string): string {
  return `${novelId}:${chapter}:${word.trim().toLowerCase()}`
}

export function getSavedWords(): SavedWord[] {
  if (typeof window === 'undefined') return []
  const val = localStorage.getItem(`${PREFIX}:savedWords`)
  return val ? (JSON.parse(val) as SavedWord[]) : []
}

export function isWordSaved(novelId: string, chapter: number, word: string): boolean {
  const id = wordId(novelId, chapter, word)
  return getSavedWords().some((w) => w.id === id)
}

export function saveWord(entry: Omit<SavedWord, 'id' | 'savedAt'>): void {
  if (typeof window === 'undefined') return
  const id = wordId(entry.novelId, entry.chapter, entry.word)
  const current = getSavedWords()
  if (current.some((w) => w.id === id)) return
  const updated = [...current, { ...entry, id, savedAt: Date.now() }]
  localStorage.setItem(`${PREFIX}:savedWords`, JSON.stringify(updated))
}

export function removeSavedWord(novelId: string, chapter: number, word: string): void {
  if (typeof window === 'undefined') return
  const id = wordId(novelId, chapter, word)
  const updated = getSavedWords().filter((w) => w.id !== id)
  localStorage.setItem(`${PREFIX}:savedWords`, JSON.stringify(updated))
}

export function toggleSavedWord(entry: Omit<SavedWord, 'id' | 'savedAt'>): boolean {
  const saved = isWordSaved(entry.novelId, entry.chapter, entry.word)
  if (saved) {
    removeSavedWord(entry.novelId, entry.chapter, entry.word)
    return false
  } else {
    saveWord(entry)
    return true
  }
}

export type ClipPosition = { x: number; y: number }

export function getClipPosition(): ClipPosition | null {
  if (typeof window === 'undefined') return null
  const val = localStorage.getItem(`${PREFIX}:clipPos`)
  return val ? (JSON.parse(val) as ClipPosition) : null
}

export function setClipPosition(pos: ClipPosition): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${PREFIX}:clipPos`, JSON.stringify(pos))
}