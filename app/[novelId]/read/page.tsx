import { notFound } from 'next/navigation'
import { getNovel } from '@/novels.config'
import { PdfViewer } from '@/components/PdfViewer'

type Props = { params: Promise<{ novelId: string }> }

export default async function PdfReaderPage({ params }: Props) {
  const { novelId } = await params
  const novel = getNovel(novelId)
  if (!novel || novel.type !== 'pdf' || !novel.pdfPath) notFound()
  return <PdfViewer novelTitle={novel.title} novelId={novelId} pdfPath={novel.pdfPath} totalPages={novel.totalChapters} />
}