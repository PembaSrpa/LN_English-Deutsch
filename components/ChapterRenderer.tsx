import { GermanWord } from './GermanWord'
import type { ParsedLine, Token } from '@/lib/parseChapter'

type ArticleStyle =
  | { kind: 'solid'; light: string; dark: string }
  | { kind: 'gradient'; lightFrom: string; lightTo: string; darkFrom: string; darkTo: string }

const MASC  = { kind: 'solid' as const, light: '#1d4ed8', dark: '#60a5fa' }
const FEM   = { kind: 'solid' as const, light: '#be185d', dark: '#f472b6' }
const NEUT  = { kind: 'solid' as const, light: '#15803d', dark: '#4ade80' }

const MASC_FEM: ArticleStyle = {
  kind: 'gradient',
  lightFrom: '#1d4ed8', lightTo: '#be185d',
  darkFrom: '#60a5fa',  darkTo: '#f472b6',
}
const MASC_NEUT: ArticleStyle = {
  kind: 'gradient',
  lightFrom: '#1d4ed8', lightTo: '#15803d',
  darkFrom: '#60a5fa',  darkTo: '#4ade80',
}
const ALL_GENDERS: ArticleStyle = {
  kind: 'gradient',
  lightFrom: '#1d4ed8', lightTo: '#be185d',
  darkFrom: '#60a5fa',  darkTo: '#f472b6',
}

const ARTICLE_MAP: Record<string, ArticleStyle> = {
  // unambiguous
  'der ':  MASC,
  'die ':  FEM,
  'das ':  NEUT,
  'den ':  MASC,
  // ambiguous masc+neut
  'dem ':  MASC_NEUT,
  'des ':  MASC_NEUT,
  'ein ':  MASC_NEUT,
  'eines': MASC_NEUT,
  'einem': MASC_NEUT,
  'kein ': MASC_NEUT,
  'keines': MASC_NEUT,
  'keinem': MASC_NEUT,
  // ambiguous fem only forms that look like others
  'einer': FEM,
  'eine ': FEM,
  'keine': FEM,
  // ambiguous all genders
  'einen': MASC,
  'keinen': MASC,
}

function getArticleMatch(text: string): { style: ArticleStyle; articleLen: number } | null {
  const lower = text.toLowerCase()
  // try longest match first (up to 6 chars + space)
  for (const key of ['keinen', 'keines', 'keinem', 'keine ', 'einen ', 'einem ', 'eines ', 'eine ', 'kein ', 'einem', 'einer', 'eines', 'einen', 'keine', 'dem ', 'den ', 'des ', 'ein ', 'der ', 'die ', 'das ']) {
    if (lower.startsWith(key) || lower === key.trimEnd()) {
      const style = ARTICLE_MAP[key] ?? ARTICLE_MAP[key.trimEnd() + ' ']
      if (style) return { style, articleLen: key.trimEnd().length }
    }
  }
  return null
}

function ArticleSpan({ text, style }: { text: string; style: ArticleStyle }) {
  if (style.kind === 'solid') {
    return (
      <>
        <style>{`.da-s{color:${style.light}}.dark .da-s{color:${style.dark}}`}</style>
        <span className="da-s font-semibold">{text}</span>
      </>
    )
  }
  const id = `dag-${text.toLowerCase().replace(/\s/g, '')}`
  return (
    <>
      <style>{`
        .${id}{background:linear-gradient(90deg,${style.lightFrom},${style.lightTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .dark .${id}{background:linear-gradient(90deg,${style.darkFrom},${style.darkTo});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      `}</style>
      <span className={`${id} font-semibold`}>{text}</span>
    </>
  )
}

function GenderedCell({ text }: { text: string }) {
  const match = getArticleMatch(text)
  if (!match) return <>{text}</>
  const article = text.slice(0, match.articleLen)
  const rest = text.slice(match.articleLen)
  return <><ArticleSpan text={article} style={match.style} />{rest}</>
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