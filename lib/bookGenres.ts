import type { Book } from '@/books.config'

export const BOOK_BUCKETS = ['Deutsch', 'Trading', 'Python', 'Data Analysis', 'Machine Learning', 'Others'] as const
export type BookBucket = (typeof BOOK_BUCKETS)[number]

const BUCKET_TAGS: { bucket: BookBucket; tags: string[] }[] = [
  { bucket: 'Deutsch', tags: ['Deutsch'] },
  { bucket: 'Trading', tags: ['Trading', 'Forex'] },
  { bucket: 'Machine Learning', tags: ['Machine Learning'] },
  { bucket: 'Data Analysis', tags: ['Data Analysis', 'Data Science', 'Statistics'] },
  { bucket: 'Python', tags: ['Python'] },
]

export function getBookBucket(book: Book): BookBucket {
  for (const { bucket, tags } of BUCKET_TAGS) {
    if (book.genre.some(g => tags.includes(g))) return bucket
  }
  return 'Others'
}

export function groupBooksByBucket(books: Book[]): { bucket: BookBucket; books: Book[] }[] {
  return BOOK_BUCKETS
    .map(bucket => ({ bucket, books: books.filter(book => getBookBucket(book) === bucket) }))
    .filter(group => group.books.length > 0)
}