import { ParallelParagraph } from './ParallelParagraph'
import type { ParsedParallelLine } from '@/lib/parseParallelChapter'

export function ParallelChapterRenderer({
  lines, fontSize, fontFamily,
}: {
  lines: ParsedParallelLine[]
  fontSize: number
  fontFamily?: string
}) {
  return (
    <div style={{ fontSize, fontFamily }}>
      {lines.map((line, i) => {
        if (line.kind === 'blank') return <div key={i} className="h-3" />

        if (line.kind === 'heading') {
          if (line.level === 1) return (
            <h1 key={i} className="text-[1.4em] font-bold text-neutral-100 mb-5 mt-2">
              {line.text}
            </h1>
          )
          if (line.level === 2) return (
            <h2 key={i} className="text-[1.1em] font-semibold text-neutral-200 mb-3 mt-8 pb-2 border-b border-neutral-600">
              {line.text}
            </h2>
          )
          return (
            <h3 key={i} className="text-[1em] font-semibold text-neutral-200 mb-2 mt-4">
              {line.text}
            </h3>
          )
        }

        return <ParallelParagraph key={i} data={line.data} />
      })}
    </div>
  )
}
