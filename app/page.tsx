import Link from 'next/link'
import novels from '@/novels.config'
import { getChapterList } from '@/lib/getChapters'
import { ContinueReading } from '@/components/ContinueReading'
import { TutorialHint } from '@/components/TutorialHint'

export default function HomePage() {
  const novelData = novels.map((novel) => {
    const chapters = getChapterList(novel.contentFolder)
    return { novel, chapterCount: chapters.length }
  })

  return (
    <div className="max-w-lg mx-auto py-10 min-h-screen">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Schatten Lesen
        </h1>
        <p className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-1">
          Read. Learn German. One chapter at a time.
        </p>
      </header>

      <TutorialHint
        id="homepage-library"
        icon="👋"
        title="Welcome to Schatten Lesen"
        body="This app helps you learn German while reading light novels. German words are highlighted inline — hover or tap any coloured word to see its translation, type, and an example sentence. Start with the Demo Novel to see how it works."
      />

      <ContinueReading novels={novels} />

      <section>
        <h2 className="text-[11px] uppercase tracking-[0.1em] text-neutral-400 dark:text-neutral-500 mb-3">
          Library
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {novelData.map(({ novel, chapterCount }) => (
            <Link
              key={novel.id}
              href={`/${novel.id}`}
              className="group border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="h-28 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative overflow-hidden">
                {novel.coverImage ? (
                  <img
                    src={novel.coverImage}
                    alt={novel.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="text-neutral-300 dark:text-neutral-700"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                )}
                {novel.id === 'demo' && (
                  <span className="absolute top-2 right-2 text-[10px] bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                    Demo
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 truncate group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                  {novel.title}
                </div>
                <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {novel.genre.map((g) => (
                    <span
                      key={g}
                      className="text-[10px] border border-neutral-200 dark:border-neutral-700 rounded px-1.5 py-0.5 text-neutral-400 dark:text-neutral-500"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
