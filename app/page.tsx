import Link from 'next/link'
import novels from '@/novels.config'
import { getChapterList } from '@/lib/getChapters'
import { ContinueReading } from '@/components/ContinueReading'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function HomePage() {
  const novelData = novels.map(novel => ({
    novel,
    chapterCount: novel.type === 'pdf' ? novel.totalChapters : getChapterList(novel.contentFolder).length,
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-neutral-200/95 dark:bg-neutral-900/95 backdrop-blur border-b border-neutral-300 dark:border-neutral-700">
        <div className="flex items-center justify-between px-8 py-3">
          <a href="https://artt-folio.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="text-sm font-bold text-neutral-800 dark:text-neutral-200 tracking-tight hover:opacity-70 transition-opacity">
            Schatten Lesen ↗
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-1">Schatten Lesen</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Read. Learn German. One chapter at a time.</p>
        </div>

        <ContinueReading novels={novels} />

        <div className="text-[10px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400 mb-3 px-1">Library</div>
        <div className="grid grid-cols-2 gap-3">
          {novelData.map(({ novel, chapterCount }) => (
            <Link key={novel.id} href={`/${novel.id}`}
              className="group border border-neutral-300 dark:border-neutral-700 rounded-xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-all bg-neutral-100 dark:bg-neutral-800">
              <div className="h-48 sm:h-56 relative overflow-hidden bg-neutral-300 dark:bg-neutral-700">
                {novel.coverImage
                  ? <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  : <div className="w-full h-full flex items-center justify-center"><span className="text-neutral-400 dark:text-neutral-600 text-4xl font-bold">{novel.title.slice(0, 1)}</span></div>
                }
                {novel.id === 'ugly-duckling' && <span className="absolute top-2 right-2 text-[9px] bg-neutral-900/80 text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Demo</span>}
                {novel.type === 'pdf' && <span className="absolute top-2 right-2 text-[9px] bg-neutral-900/80 text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">PDF</span>}
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate mb-0.5">{novel.title}</div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">{novel.author}</div>
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">{chapterCount} {novel.type === 'pdf' ? 'pages' : 'chapters'}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
