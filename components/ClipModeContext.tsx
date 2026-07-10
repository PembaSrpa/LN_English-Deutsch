'use client'
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { toggleSavedWord, getClipState, setClipState, type SavedWord } from '@/lib/storage'

type ClipModeContextValue = {
  active: boolean
  toggle: () => void
  clipWord: (entry: Omit<SavedWord, 'id' | 'savedAt'>) => boolean
}

const ClipModeContext = createContext<ClipModeContextValue | null>(null)

type ProviderProps = {
  children: React.ReactNode
  // Pass something that changes on navigation (e.g. chapter number). The
  // reader page doesn't remount between chapters, so without this, clip
  // mode would stay armed after clicking Next/Prev. The very first render
  // is exempt, so a refresh still restores whatever was last saved.
  resetKey?: string | number
}

export function ClipModeProvider({ children, resetKey }: ProviderProps) {
  // Lazy-init so the very first render already reflects whatever the user
  // left clip mode as before the page was refreshed.
  const [active, setActive] = useState(() => getClipState()?.active ?? false)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    // Chapter changed — always drop back to idle, even if clip mode was
    // left armed on the previous chapter.
    setActive(false)
    const prev = getClipState()
    setClipState({ x: prev?.x ?? 0, y: prev?.y ?? 0, active: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

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