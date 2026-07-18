import { ParallelSentence } from './ParallelSentence'
import type { ParsedParallelLine, ParallelToken } from '@/lib/parseParallelChapter'

function Tokens({ tokens }: { tokens: ParallelToken[] }) {
  return (
    <>
      {tokens.map((t, i) => {
        if (t.kind === 'sentence') return <ParallelSentence key={i} data={t.data} />
        return <span key={i}>{t.value}</span>
      })}
    </>
  )
}

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
              <Tokens tokens={line.tokens} />
            </h1>
          )
          if (line.level === 2) return (
            <h2 key={i} className="text-[1.1em] font-semibold text-neutral-200 mb-3 mt-8 pb-2 border-b border-neutral-600">
              <Tokens tokens={line.tokens} />
            </h2>
          )
          return (
            <h3 key={i} className="text-[1em] font-semibold text-neutral-200 mb-2 mt-4">
              <Tokens tokens={line.tokens} />
            </h3>
          )
        }

        return (
          <p key={i} className="leading-[1.95] mb-4 text-[1em]">
            <Tokens tokens={line.tokens} />
          </p>
        )
      })}
    </div>
  )
}
