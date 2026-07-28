import Link from 'next/link'
import books from '@/books.config'
import { HomeHeader } from '@/components/HomeHeader'

export default function TechnicalPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />

      <main className="flex-1 px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-8">
        <div className="mb-8">
          <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-100 transition-colors">
            ← Library
          </Link>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight mt-2 mb-1">Educational / Technical Books</h1>
          <p className="text-xs text-neutral-400">Trading, Python, data analysis, and machine learning references.</p>
        </div>

        {books.length === 0 && (
          <p className="text-xs text-neutral-400">No books added yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {books.map(book => (
            <Link key={book.id} href={`/technical/${book.id}`}
              className="flex items-center justify-between gap-3 border border-neutral-600 rounded-lg px-4 py-3 hover:border-neutral-500 hover:bg-neutral-700 transition-colors">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-neutral-100 truncate">{book.title}</div>
                <div className="text-xs text-neutral-400 truncate">{book.author}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
