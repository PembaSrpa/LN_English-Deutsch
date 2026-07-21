'use client'
import { IconVolume2 } from '@tabler/icons-react'
import { useWordNarration } from './WordNarrationContext'
import { useWordBookmark } from './WordBookmarkContext'
import { useSettings } from './SettingsContext'

export function WordNarrationToggle() {
  const { active, toggle } = useWordNarration()
  const { deactivate: deactivateBookmark } = useWordBookmark()
  const { voiceEnabled } = useSettings()

  if (!voiceEnabled) return null

  const handleClick = () => {
    if (!active) deactivateBookmark()
    toggle()
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'Cancel word narration selection' : 'Hear a word spoken aloud'}
      title={active ? 'Tap a word to hear it' : 'Narrate a word'}
      className={`py-2 px-3 rounded-md transition-colors border ${
        active ? 'bg-neutral-600 border-neutral-500' : 'border-transparent hover:bg-neutral-600 hover:border-neutral-500'
      }`}
    >
      <IconVolume2 size={16} className={active ? 'text-amber-400' : 'text-neutral-300'} />
    </button>
  )
}
