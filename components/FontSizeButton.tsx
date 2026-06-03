'use client'
import { useState } from 'react'

const SIZES = [{ label: 'S', value: 13 }, { label: 'M', value: 15 }, { label: 'L', value: 18 }]

export function FontSizeButton({ onChange }: { onChange: (v: number) => void }) {
  const [idx, setIdx] = useState(1)
  return (
    <button
      onClick={() => { const next = (idx + 1) % 3; setIdx(next); onChange(SIZES[next].value) }}
      className="py-2 px-3 text-[11px] font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-800 rounded-md transition-colors border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 min-w-[36px]"
    >
      {SIZES[idx].label}
    </button>
  )
}
