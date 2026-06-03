import { GermanWord } from './GermanWord'
import type { ParsedLine, Token } from '@/lib/parseChapter'

const ARTICLE_STYLES: Record<string, { type: string; light: string; dark: string }> = {
  'der ': { type: 'masc', light: '#1d4ed8', dark: '#60a5fa' },
  'die ': { type: 'fem',  light: '#be185d', dark: '#f472b6' },
  'das ': { type: 'neut', light: '#15803d', dark: '#4ade80' },
}

function GenderedCell({ text }: { text: string }) {
  const match = ARTICLE_STYLES[text.slice(0, 4).toLowerCase()]
  if (!match) return <>{text}</>
  const article = text.slice(0, 3)
  const rest = text.slice(3)
  return (
    <>
      <style>{`.de-art-${match.type}{color:${match.light}} .dark .de-art-${match.type}{color:${match.dark}}`}</style>
      <span className={`de-art-${match.type} font-semibold`}>{article}</span>
      {rest}
    </>
  )
}

function Tokens({ tokens }: { tokens: Token[] }) {
  return <>
    {tokens.map((t, i) =>
      t.kind === 'text'
        ? <span key={i}>{t.value}</span>
        : <GermanWord key={i} data={t.data} />
    )}
  </>
}

export function ChapterRenderer({ lines, fontSize }: { lines: ParsedLine[]; fontSize: number }) {
  return (
    <div style={{ fontSize }} className="font-mono">
      {lines.map((line, i) => {
        if (line.kind === 'blank') return <div key={i} className="h-3" />
        if (line.kind === 'heading') {
          if (line.level === 1) return (
            <h1 key={i} className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-5 mt-2">
              <Tokens tokens={line.tokens} />
            </h1>
          )
          if (line.level === 2) return (
            <h2 key={i} className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-3 mt-8 pb-2 border-b border-neutral-300 dark:border-neutral-700">
              <Tokens tokens={line.tokens} />
            </h2>
          )
          return (
            <h3 key={i} className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 mt-4">
              <Tokens tokens={line.tokens} />
            </h3>
          )
        }
        if (line.kind === 'table') return (
          <div key={i} className="my-6 overflow-x-auto rounded-xl border border-neutral-300 dark:border-neutral-700">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-neutral-300 dark:bg-neutral-800">
                <tr>
                  {line.headers.map((h, j) => (
                    <th key={j} className="text-left py-2 px-3 font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {line.rows.map((row, j) => (
                  <tr key={j} className="border-t border-neutral-200 dark:border-neutral-700 even:bg-neutral-100 dark:even:bg-neutral-800/50">
                    {row.map((cell, k) => (
                      <td key={k} className="py-2 px-3 text-neutral-800 dark:text-neutral-200">
                        <GenderedCell text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        return (
          <p key={i} className="leading-[1.95] text-neutral-800 dark:text-neutral-200 mb-4 text-[15px]">
            <Tokens tokens={line.tokens} />
          </p>
        )
      })}
    </div>
  )
}