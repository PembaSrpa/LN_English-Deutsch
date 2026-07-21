'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSettings } from './SettingsContext'
import type { NovelType } from '@/lib/tutorialContent'

type TutorialContextValue = {
  open: boolean
  show: () => void
  hide: () => void
}

const TutorialContext = createContext<TutorialContextValue | null>(null)

const STORAGE_PREFIX = 'tutorial-seen:'

type ProviderProps = {
  children: React.ReactNode
  novelType: NovelType
}

export function TutorialProvider({ children, novelType }: ProviderProps) {
  const { tutorialTipsEnabled } = useSettings()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!tutorialTipsEnabled) return
    const key = STORAGE_PREFIX + novelType
    if (window.localStorage.getItem(key)) return
    window.localStorage.setItem(key, '1')
    setOpen(true)
  }, [novelType, tutorialTipsEnabled])

  const show = useCallback(() => setOpen(true), [])
  const hide = useCallback(() => setOpen(false), [])

  return (
    <TutorialContext.Provider value={{ open, show, hide }}>
      {children}
    </TutorialContext.Provider>
  )
}

export function useTutorial(): TutorialContextValue {
  const ctx = useContext(TutorialContext)
  if (!ctx) throw new Error('useTutorial must be used within a TutorialProvider')
  return ctx
}
