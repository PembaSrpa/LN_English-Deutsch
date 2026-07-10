'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { toggleSavedWord, getClipState, setClipState, type SavedWord } from '@/lib/storage'

type ClipModeContextValue = {
  active: boolean
  toggle: () => void
  clipWord: (entry: Omit<SavedWord, 'id' | 'savedAt'>) => boolean
}

const ClipModeContext = createContext<ClipModeContextValue | null>(null)

export function ClipModeProvider({ children }: { children: React.ReactNode }) {
  // Lazy-init so the very first render already reflects whatever the user
  // left clip mode as before the page was refreshed.
  const [active, setActive] = useState(() => getClipState()?.active ?? false)

  const toggle = useCallback(() => {
    setActive((a) => {
      const next = !a
      // Persist immediately so a refresh mid-session doesn't drop back to
      // whatever stale idle position was last saved. WordClipButton overwrites
      // x/y with the real position right after this, but we don't want a
      // refresh in the split second between toggle and that write to lose
      // the "active" flag.
      const prev = getClipState()
      setClipState({ x: prev?.x ?? 0, y: prev?.y ?? 0, active: next })
      return next
    })
  }, [])
  const clipWord = useCallback((entry: Omit<SavedWord, 'id' | 'savedAt'>) => {
    return toggleSavedWord(entry)
  }, [])

  return (
    <ClipModeContext.Provider value={{ active, toggle, clipWord }}>
      {children}
    </ClipModeContext.Provider>
  )
}

export function useClipMode(): ClipModeContextValue {
  const ctx = useContext(ClipModeContext)
  if (!ctx) throw new Error('useClipMode must be used within a ClipModeProvider')
  return ctx
}