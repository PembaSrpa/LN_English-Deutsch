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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {books.map(book => (
            <Link key={book.id} href={`/technical/${book.id}`}
              className="group border border-neutral-600 rounded-xl overflow-hidden hover:border-neutral-500 transition-all bg-neutral-700">
              <div className="relative overflow-hidden bg-neutral-600 flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
                <span className="text-neutral-400 text-4xl font-bold">{book.title.slice(0, 1)}</span>
              </div>
              <div className="p-3 bg-neutral-700">
                <div className="text-xs font-semibold text-neutral-100 truncate mb-0.5">{book.title}</div>
                <div className="text-[0.625rem] text-neutral-400 truncate">{book.author}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
