'use client'

import { useState } from 'react'

const SIZES = [
  { label: 'S', value: 14 },
  { label: 'M', value: 16 },
  { label: 'L', value: 19 },
]

export function FontSizeButton({ onChange }: { onChange: (size: number) => void }) {
  const [idx, setIdx] = useState(1)

  function cycle() {
    const next = (idx + 1) % SIZES.length
    setIdx(next)
    onChange(SIZES[next].value)
  }

  return (
    <button
      onClick={cycle}
      className="text-[11px] font-medium px-2 py-1 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-w-[28px]"
      aria-label="Cycle font size"
    >
      {SIZES[idx].label}
    </button>
  )
}
