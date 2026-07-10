'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { toggleSavedWord, type SavedWord } from '@/lib/storage'

type ClipModeContextValue = {
  active: boolean
  toggle: () => void
  clipWord: (entry: Omit<SavedWord, 'id' | 'savedAt'>) => boolean
}

const ClipModeContext = createContext<ClipModeContextValue | null>(null)

export function ClipModeProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false)

  const toggle = useCallback(() => setActive((a) => !a), [])
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