'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSettings } from './SettingsContext'
import type { ParagraphPair } from '@/lib/parseParallelChapter'

type Props = {
  data: ParagraphPair
}

const WARP_TRANSITION = { duration: 0.5, ease: 'easeInOut' as const }

const EXIT_WARP = {
  skewX: [0, 5, -4, 3, -2, 0],
  scaleX: [1, 1.03, 0.98, 1.015, 0.99, 1],
  scaleY: [1, 0.97, 1.03, 0.98, 1.01, 1],
  filter: ['blur(0px)', 'blur(2px)', 'blur(0px)', 'blur(2px)', 'blur(0px)', 'blur(3px)'],
  opacity: [1, 0.9, 1, 0.9, 1, 0],
}

const ENTER_WARP = {
  skewX: [6, -5, 3, -1.5, 0],
  scaleX: [0.96, 1.04, 0.98, 1.01, 1],
  scaleY: [1.04, 0.96, 1.02, 0.99, 1],
  filter: ['blur(3px)', 'blur(1px)', 'blur(2px)', 'blur(0.5px)', 'blur(0px)'],
  opacity: [0, 1, 0.85, 1, 1],
}

export function ParallelParagraph({ data }: Props) {
  const { languageMode } = useSettings()
  const [revealed, setRevealed] = useState(false)

  if (languageMode === 'en') {
    return <p className="leading-[1.95] mb-4 text-[1em] text-neutral-200">{data.english}</p>
  }

  if (languageMode === 'de') {
    return <p className="leading-[1.95] mb-4 text-[1em] text-neutral-200">{data.german}</p>
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.p
        key={revealed ? 'en' : 'de'}
        onClick={() => setRevealed((v) => !v)}
        exit={EXIT_WARP}
        animate={ENTER_WARP}
        transition={WARP_TRANSITION}
        className={`leading-[1.95] mb-4 text-[1em] cursor-pointer touch-manipulation ${revealed ? 'text-neutral-400' : 'text-neutral-200'}`}
      >
        {revealed ? data.english : data.german}
      </motion.p>
    </AnimatePresence>
  )
}
