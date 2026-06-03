import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNovel } from '@/novels.config'
import { getChapterList } from '@/lib/getChapters'
import { NovelPageClient } from '@/components/NovelPageClient'
import { ThemeToggle } from '@/components/ThemeToggle'
import { IconArrowLeft } from '@tabler/icons-react'

type Props = { params: Promise<{ novelId: string }> }

export default async function NovelPage({ params }: Props) {
  const { novelId } = await params
  const novel = getNovel(novelId)
  if (!novel) notFound()
  const chapters = novel.type === 'md' ? getChapterList(novel.contentFolder) : []

  return (
    <div className="min-h-screen flex flex-col bg-neutral-200 dark:bg-neutral-900">
      <header className="sticky top-0 z-40 bg-neutral-200/95 dark:bg-neutral-900/95 backdrop-blur border-b border-neutral-300 dark:border-neutral-700">
        <div className="flex items-center justify-between px-8 py-2">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
            <IconArrowLeft size={14} /> Library
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 px-8 py-8">
        <div className="flex gap-4 mb-6">
          <div className="w-20 flex-shrink-0 rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-300 dark:bg-neutral-800" style={{ aspectRatio: '2/3' }}>
            {novel.coverImage
              ? <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><span className="text-2xl font-bold text-neutral-400">{novel.title.slice(0, 1)}</span></div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-0.5 leading-tight">{novel.title}</h1>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mb-2">{novel.author}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {novel.genre.map(g => <span key={g} className="text-[9px] border border-neutral-300 dark:border-neutral-700 rounded-md px-1.5 py-0.5 text-neutral-400 dark:text-neutral-500">{g}</span>)}
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">{novel.description}</p>
          </div>
        </div>
        {novel.type === 'pdf'
          ? <Link href={`/${novelId}/read`} className="block w-full py-2.5 text-center text-xs font-bold bg-neutral-800 dark:bg-neutral-100 text-white dark:text-black rounded-full hover:opacity-90 transition-opacity mb-6">Open PDF Reader</Link>
          : <NovelPageClient novelId={novelId} chapters={chapters} />
        }
        {novel.type === 'md' && chapters.length > 0 && (
          <>
            <div className="text-[10px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400 mb-2 px-1">Chapters</div>
            <div className="flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700 border border-neutral-300 dark:border-neutral-700 rounded-xl overflow-hidden">
              {chapters.map(ch => (
                <Link key={ch.id} href={`/${novelId}/${ch.id}`} className="flex items-center gap-3 py-3 px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-600 w-5 text-right flex-shrink-0 tabular-nums">{ch.id}</span>
                  <span className="flex-1 text-xs text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors truncate">{ch.title}</span>
                  {ch.germanPercent && <span className="text-[10px] text-neutral-400 dark:text-neutral-600 flex-shrink-0">{ch.germanPercent}</span>}
                  <IconArrowLeft size={11} className="text-neutral-300 dark:text-neutral-700 rotate-180 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}