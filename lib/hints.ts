'use client'

const KEY = 'schatten-lesen:hints-dismissed'

export type HintId =
  | 'homepage-library'
  | 'novel-chapters'
  | 'reader-german-word'
  | 'reader-bookmark'
  | 'reader-font'

export function isHintDismissed(id: HintId): boolean {
  if (typeof window === 'undefined') return false
  const val = localStorage.getItem(KEY)
  if (!val) return false
  const dismissed: HintId[] = JSON.parse(val)
  return dismissed.includes(id)
}

export function dismissHint(id: HintId): void {
  if (typeof window === 'undefined') return
  const val = localStorage.getItem(KEY)
  const dismissed: HintId[] = val ? JSON.parse(val) : []
  if (!dismissed.includes(id)) {
    dismissed.push(id)
    localStorage.setItem(KEY, JSON.stringify(dismissed))
  }
}

export function resetAllHints(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}
