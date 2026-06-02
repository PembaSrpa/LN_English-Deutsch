'use client'

import { useState, useEffect } from 'react'
import { isHintDismissed, dismissHint, type HintId } from '@/lib/hints'

type Props = {
  id: HintId
  icon: string
  title: string
  body: string
  position?: 'default' | 'floating'
}

export function TutorialHint({ id, icon, title, body, position = 'default' }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(!isHintDismissed(id))
  }, [id])

  function handleDismiss() {
    dismissHint(id)
    setVisible(false)
  }

  if (!visible) return null

  if (position === 'floating') {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[min(340px,calc(100vw-48px))] animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 mb-1">{title}</div>
              <div className="text-[12px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{body}</div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-neutral-300 dark:text-neutral-600 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors mt-0.5"
              aria-label="Dismiss hint"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-[11px] text-neutral-300 dark:text-neutral-600 uppercase tracking-wider">Tutorial</span>
            <button
              onClick={handleDismiss}
              className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 animate-in fade-in duration-300">
      <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-4 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">{title}</div>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-neutral-300 dark:text-neutral-600 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
                aria-label="Dismiss hint"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-[12px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{body}</div>
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center border-t border-neutral-200 dark:border-neutral-800 pt-3">
          <span className="text-[10px] text-neutral-300 dark:text-neutral-600 uppercase tracking-wider font-medium">Schatten Lesen · Tutorial</span>
          <button
            onClick={handleDismiss}
            className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
