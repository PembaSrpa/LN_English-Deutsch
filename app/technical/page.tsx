'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { IconArrowLeft } from '@tabler/icons-react'
import books from '@/books.config'
import { groupBooksByBucket } from '@/lib/bookGenres'
import { SettingsPanel } from '@/components/SettingsPanel'

export default function TechnicalPage() {
  const groups = groupBooksByBucket(books)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-neutral-750 border-b border-neutral-600">
        <div className="flex items-center justify-between px-8 py-2">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Link href="/" className="flex items-center gap-1.5 text-xs text-neutral-100 font-medium hover:text-[var(--n-emphasis)] transition-colors">
              <IconArrowLeft size={14} /> Library
            </Link>
          </motion.div>
          <SettingsPanel showPdfMode />
        </div>
      </header>

      <main className="flex-1 px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight mb-1">Read Educational Books</h1>
          <p className="text-xs text-neutral-400">German study material, trading, Python, data analysis, and machine learning references.</p>
        </div>

        {books.length === 0 && (
          <p className="text-xs text-neutral-400">No books added yet.</p>
        )}

        {groups.map(({ bucket, books: bucketBooks }) => (
          <div key={bucket} className="mb-8">
            <div className="text-[0.625rem] uppercase tracking-[0.12em] text-neutral-400 mb-3 px-1">{bucket}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {bucketBooks.map(book => (
                <Link key={book.id} href={`/technical/${book.id}`}
                  className="flex items-center justify-between gap-3 border border-neutral-600 rounded-lg px-4 py-3 hover:border-neutral-500 hover:bg-neutral-700 transition-colors">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-neutral-100 truncate">{book.title}</div>
                    <div className="text-xs text-neutral-400 truncate">{book.author || book.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}