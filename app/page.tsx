import Link from 'next/link'
import novels from '@/novels.config'
import { getChapterList } from '@/lib/getChapters'
import { ContinueReading } from '@/components/ContinueReading'
import { HomeHeader } from '@/components/HomeHeader'

export default function HomePage() {
  const novelData = novels.map(novel => ({
    novel,
    chapterCount: getChapterList(novel.contentFolder).length,
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />

      <main className="flex-1 px-[calc(1.25rem+2px)] md:px-[calc(2.5rem+2px)] py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight mb-1">Schatten Lesen</h1>
          <p className="text-xs text-neutral-400">Read. Learn German. One chapter at a time.</p>
        </div>

        <ContinueReading novels={novels} />

        <div className="text-[10px] uppercase tracking-[0.12em] text-neutral-400 mb-3 px-1">Library</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {novelData.map(({ novel }) => (
            <Link key={novel.id} href={`/${novel.id}`}
              className="group border border-neutral-600 rounded-xl overflow-hidden hover:border-neutral-500 transition-all bg-neutral-700">
              <div className="relative overflow-hidden bg-neutral-600" style={{ aspectRatio: '4/3' }}>
                {novel.coverImage ? (
                  <>
                    <img
                      src={novel.coverImage}
                      alt={novel.title}
                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm opacity-60"
                    />
                    <img
                      src={novel.coverImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-neutral-400 text-4xl font-bold">{novel.title.slice(0, 1)}</span>
                  </div>
                )}
                {novel.id === 'ugly-duckling' && (
                  <span className="absolute top-2 right-2 text-[9px] bg-neutral-900/80 text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider z-10">
                    Demo
                  </span>
                )}
              </div>
              <div className="p-3 bg-neutral-700">
                <div className="text-xs font-semibold text-neutral-100 truncate mb-0.5">{novel.title}</div>
                <div className="text-[10px] text-neutral-400 truncate">{novel.author}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}