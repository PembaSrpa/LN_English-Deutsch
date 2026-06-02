import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNovel } from '@/novels.config'
import { getChapterList } from '@/lib/getChapters'
import { TutorialHint } from '@/components/TutorialHint'
import { NovelPageClient } from '@/components/NovelPageClient'

type Props = { params: Promise<{ novelId: string }> }

export default async function NovelPage({ params }: Props) {
  const { novelId } = await params
  const novel = getNovel(novelId)
  if (!novel) notFound()

  const chapters = getChapterList(novel.contentFolder)

  return (
    <div className="max-w-lg mx-auto py-8 min-h-screen">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Library
      </Link>

      <div className="flex gap-4 mb-6">
        <div className="w-[72px] h-[96px] bg-neutral-100 dark:bg-neutral-900 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-800">
          {novel.coverImage ? (
            <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover" />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-neutral-300 dark:text-neutral-700">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5">
            {novel.title}
          </h1>
          <p className="text-[12px] text-neutral-400 dark:text-neutral-500 mb-2">{novel.author}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {novel.genre.map((g) => (
              <span key={g} className="text-[10px] border border-neutral-200 dark:border-neutral-700 rounded px-1.5 py-0.5 text-neutral-400 dark:text-neutral-500">
                {g}
              </span>
            ))}
          </div>
          <p className="text-[12px] text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
            {novel.description}
          </p>
        </div>
      </div>

      <NovelPageClient novelId={novelId} chapters={chapters} />

      <TutorialHint
        id="novel-chapters"
        icon="📖"
        title="Choose a chapter to begin"
        body="Chapters are listed below. Each one shows the German vocabulary target — the percentage of words that have been translated. Start from Chapter 1 and work your way up as the German density increases."
      />

      <div className="mt-4">
        <h2 className="text-[11px] uppercase tracking-[0.1em] text-neutral-400 dark:text-neutral-500 mb-2">
          Chapters
        </h2>
        <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900">
          {chapters.map((ch) => (
            <Link
              key={ch.id}
              href={`/${novelId}/${ch.id}`}
              className="flex items-center gap-3 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 -mx-2 px-2 rounded-lg transition-colors group"
            >
              <span className="text-[11px] text-neutral-300 dark:text-neutral-600 w-6 text-right flex-shrink-0 font-mono">
                {ch.id}
              </span>
              <span className="flex-1 text-[13px] text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors truncate">
                {ch.title}
              </span>
              {ch.germanPercent && (
                <span className="text-[11px] text-neutral-300 dark:text-neutral-600 flex-shrink-0">
                  {ch.germanPercent}
                </span>
              )}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-200 dark:text-neutral-700 flex-shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
