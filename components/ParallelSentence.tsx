'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSettings } from './SettingsContext'
import type { SentencePair } from '@/lib/parseParallelChapter'

type Props = {
  data: SentencePair
}

const WARP_TRANSITION = { duration: 0.45, ease: 'easeInOut' as const }

const EXIT_WARP = {
  skewX: [0, 6, -5, 4, -3, 0],
  scaleX: [1, 1.04, 0.97, 1.02, 0.98, 1],
  scaleY: [1, 0.96, 1.04, 0.97, 1.02, 1],
  filter: ['blur(0px)', 'blur(2px)', 'blur(0px)', 'blur(2px)', 'blur(0px)', 'blur(3px)'],
  opacity: [1, 0.9, 1, 0.9, 1, 0],
}

const ENTER_WARP = {
  skewX: [8, -6, 4, -2, 0],
  scaleX: [0.95, 1.05, 0.98, 1.02, 1],
  scaleY: [1.05, 0.95, 1.02, 0.99, 1],
  filter: ['blur(3px)', 'blur(1px)', 'blur(2px)', 'blur(0.5px)', 'blur(0px)'],
  opacity: [0, 1, 0.85, 1, 1],
}

export function ParallelSentence({ data }: Props) {
  const { languageMode } = useSettings()
  const [revealed, setRevealed] = useState(false)

  if (languageMode === 'en') {
    return <span className="text-neutral-200">{data.english} </span>
  }

  if (languageMode === 'de') {
    return <span className="text-neutral-200">{data.german} </span>
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={revealed ? 'en' : 'de'}
        onClick={() => setRevealed((v) => !v)}
        exit={EXIT_WARP}
        animate={ENTER_WARP}
        transition={WARP_TRANSITION}
        className={`inline-block cursor-pointer touch-manipulation ${revealed ? 'text-neutral-400' : 'text-neutral-200'}`}
      >
        {revealed ? data.english : data.german}{' '}
      </motion.span>
    </AnimatePresence>
  )
}
