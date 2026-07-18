import { notFound } from 'next/navigation'
import novels, { getNovel } from '@/novels.config'
import { getChapterRaw, getChapterList } from '@/lib/getChapters'
import { parseChapter } from '@/lib/parseChapter'
import { parseParallelChapter } from '@/lib/parseParallelChapter'
import { ReaderClient } from '@/components/ReaderClient'
import { ParallelReaderClient } from '@/components/ParallelReaderClient'

export function generateStaticParams() {
  return novels.flatMap(novel => {
    if (novel.type !== 'md' && novel.type !== 'parallel') return []
    const chapters = getChapterList(novel.contentFolder)
    return chapters.map(ch => ({ novelId: novel.id, chapterId: String(ch.id) }))
  })
}

type Props = { params: Promise<{ novelId: string; chapterId: string }> }

export default async function ReaderPage({ params }: Props) {
  const { novelId, chapterId } = await params
  const novel = getNovel(novelId)
  if (!novel) notFound()
  const chapterNum = parseInt(chapterId, 10)
  if (isNaN(chapterNum)) notFound()
  const raw = getChapterRaw(novel.contentFolder, chapterNum)
  if (!raw) notFound()
  const chapters = getChapterList(novel.contentFolder)

  if (novel.type === 'parallel') {
    const lines = parseParallelChapter(raw)
    return (
      <ParallelReaderClient
        novelId={novelId}
        novelTitle={novel.title}
        chapterNum={chapterNum}
        availableChapters={chapters.length}
        lines={lines}
      />
    )
  }

  if (novel.type !== 'md') notFound()
  const lines = parseChapter(raw)
  return (
    <ReaderClient
      novelId={novelId}
      novelTitle={novel.title}
      chapterNum={chapterNum}
      totalChapters={novel.totalChapters}
      availableChapters={chapters.length}
      lines={lines}
      showAnnotationToggle={!novel.genre.includes('IELTS')}
      isDemo={novelId === 'ugly-duckling'}
    />
  )
}
