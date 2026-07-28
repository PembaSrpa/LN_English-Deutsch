import { notFound } from 'next/navigation'
import books, { getBook } from '@/books.config'
import { PdfReaderClient } from '@/components/PdfReaderClient'

export function generateStaticParams() {
  return books.map(book => ({ bookId: book.id }))
}

export const dynamicParams = false

type Params = { bookId: string }

export default async function TechnicalBookPage({ params }: { params: Promise<Params> }) {
  const { bookId } = await params
  const book = getBook(bookId)
  if (!book) notFound()

  return <PdfReaderClient bookId={book.id} bookTitle={book.title} pdfFile={book.pdfFile} />
}
