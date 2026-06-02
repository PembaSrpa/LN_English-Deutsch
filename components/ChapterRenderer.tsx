import { GermanWord } from './GermanWord'
import type { ParsedLine, Token } from '@/lib/parseChapter'

function RenderTokens({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((token, i) =>
        token.kind === 'text' ? (
          <span key={i}>{token.value}</span>
        ) : (
          <GermanWord key={i} data={token.data} />
        )
      )}
    </>
  )
}

export function ChapterRenderer({ lines, fontSize }: { lines: ParsedLine[]; fontSize: number }) {
  return (
    <div style={{ fontSize }}>
      {lines.map((line, i) => {
        if (line.kind === 'blank') return <div key={i} className="h-3" />

        if (line.kind === 'heading') {
          if (line.level === 1)
            return (
              <h1 key={i} className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 mt-2">
                <RenderTokens tokens={line.tokens} />
              </h1>
            )
          if (line.level === 2)
            return (
              <h2 key={i} className="font-display text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3 mt-6">
                <RenderTokens tokens={line.tokens} />
              </h2>
            )
          return (
            <h3 key={i} className="font-sans text-base font-medium text-neutral-700 dark:text-neutral-300 mb-2 mt-4">
              <RenderTokens tokens={line.tokens} />
            </h3>
          )
        }

        if (line.kind === 'table') {
          return (
            <div key={i} className="my-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    {line.headers.map((h, j) => (
                      <th key={j} className="text-left py-2 pr-4 font-medium text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {line.rows.map((row, j) => (
                    <tr key={j} className="border-b border-neutral-100 dark:border-neutral-800">
                      {row.map((cell, k) => (
                        <td key={k} className="py-2 pr-4 text-neutral-700 dark:text-neutral-300">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        return (
          <p key={i} className="leading-[1.9] text-neutral-800 dark:text-neutral-200 mb-4">
            <RenderTokens tokens={line.tokens} />
          </p>
        )
      })}
    </div>
  )
}
