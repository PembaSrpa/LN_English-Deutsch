'use client'
import { useState, useEffect } from 'react'
import { isHintDismissed, dismissHint, type HintId } from '@/lib/hints'
import { IconX } from '@tabler/icons-react'

type Props = { id: HintId; icon: React.ReactNode; title: string; body: string }

export function TutorialHint({ id, icon, title, body }: Props) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setVisible(!isHintDismissed(id)) }, [id])
  if (!visible) return null

  return (
    <div className="mb-5 border border-dashed border-neutral-400 dark:border-neutral-600 rounded-xl p-3 bg-neutral-100 dark:bg-neutral-800">
      <div className="flex items-start gap-2.5">
        <span className="text-neutral-500 dark:text-neutral-400 mt-0.5 flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">{title}</div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{body}</div>
        </div>
        <button onClick={() => { dismissHint(id); setVisible(false) }} className="flex-shrink-0 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
          <IconX size={13} />
        </button>
      </div>
    </div>
  )
}
