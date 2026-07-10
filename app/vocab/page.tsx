import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import { VocabClient } from '@/components/VocabClient'

export default function VocabPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-neutral-750 backdrop-blur border-b border-neutral-600">
        <div className="flex items-center px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-3">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-neutral-100 font-medium hover:text-white transition-colors">
            <IconArrowLeft size={14} />
            Home
          </Link>
        </div>
      </header>

      <main className="flex-1 px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight mb-1">Saved Words</h1>
          <p className="text-xs text-neutral-400">Vocabulary you've bookmarked while reading.</p>
        </div>
        <VocabClient />
      </main>
    </div>
  )
}
