import Link from 'next/link'
import novels from '@/novels.config'
import { getChapterList } from '@/lib/getChapters'
import { ContinueReading } from '@/components/ContinueReading'
import { TutorialHint } from '@/components/TutorialHint'
import { ThemeToggle } from '@/components/ThemeToggle'
import { IconBooks } from '@tabler/icons-react'

export default function HomePage() {
  const novelData = novels.map(novel => ({
    novel,
    chapterCount: novel.type === 'pdf' ? novel.totalChapters : getChapterList(novel.contentFolder).length,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-neutral-200 dark:bg-neutral-900">
      <header className="sticky top-0 z-40 bg-neutral-200/90 dark:bg-neutral-900/90 backdrop-blur border-b border-neutral-300 dark:border-neutral-700">
        <div className="flex items-center justify-between px-8 py-3">
          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">Schatten Lesen</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-1">Schatten Lesen</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Read. Learn German. One chapter at a time.</p>
        </div>

        <TutorialHint
          id="homepage-library"
          icon={<IconBooks size={14} />}
          title="Welcome"
          body="Tap coloured German words while reading to see translations. Start with The Ugly Duckling for a quick demo."
        />

        <ContinueReading novels={novels} />

        <div className="text-[10px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400 mb-3 px-1">Library</div>
        <div className="grid grid-cols-2 gap-3">
          {novelData.map(({ novel, chapterCount }) => (
            <Link key={novel.id} href={`/${novel.id}`}
              className="group border border-neutral-300 dark:border-neutral-700 rounded-2xl overflow-hidden hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all"
              style={{ boxShadow: 'var(--shadow-aceternity)' }}
            >
              <div className="h-24 bg-neutral-300 dark:bg-neutral-800 flex items-center justify-center relative">
                {novel.coverImage
                  ? <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover" />
                  : <span className="text-neutral-400 dark:text-neutral-600 text-3xl font-bold">{novel.title.slice(0, 1)}</span>
                }
                {novel.id === 'ugly-duckling' && (
                  <span className="absolute top-2 right-2 text-[9px] bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Demo</span>
                )}
                {novel.type === 'pdf' && (
                  <span className="absolute top-2 right-2 text-[9px] bg-neutral-600 dark:bg-neutral-300 text-white dark:text-black px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">PDF</span>
                )}
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate mb-0.5">{novel.title}</div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500">{novel.author}</div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">{chapterCount} {novel.type === 'pdf' ? 'pages' : 'chapters'}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {novel.genre.map(g => (
                    <span key={g} className="text-[9px] border border-neutral-300 dark:border-neutral-700 rounded-md px-1.5 py-0.5 text-neutral-400 dark:text-neutral-500">{g}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}