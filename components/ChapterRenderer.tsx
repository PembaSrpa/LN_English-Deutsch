import { GermanWord } from './GermanWord'
import type { ParsedLine, Token } from '@/lib/parseChapter'

type ArticleStyle =
  | { kind: 'solid';    id: string; light: string; dark: string }
  | { kind: 'gradient'; id: string; lightFrom: string; lightTo: string; darkFrom: string; darkTo: string }
  | { kind: 'ambiguous' }

const MASC:      ArticleStyle = { kind: 'solid',    id: 'masc',     light: '#1d4ed8', dark: '#60a5fa' }
const FEM:       ArticleStyle = { kind: 'solid',    id: 'fem',      light: '#c2003f', dark: '#ff6b9d' }
const NEUT:      ArticleStyle = { kind: 'solid',    id: 'neut',     light: '#047857', dark: '#34d399' }
const MASC_NEUT: ArticleStyle = { kind: 'gradient', id: 'mascneut', lightFrom: '#1d4ed8', lightTo: '#047857', darkFrom: '#60a5fa', darkTo: '#34d399' }
const AMBIGUOUS: ArticleStyle = { kind: 'ambiguous' }

const STYLE_CSS = `
  .da-masc { color: #1d4ed8 } .dark .da-masc { color: #60a5fa }
  .da-fem  { color: #c2003f } .dark .da-fem  { color: #ff6b9d }
  .da-neut { color: #047857 } .dark .da-neut { color: #34d399 }
  .da-mascneut {
    background: linear-gradient(90deg,#1d4ed8,#047857);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .dark .da-mascneut {
    background: linear-gradient(90deg,#60a5fa,#34d399);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .da-ambiguous {
    text-decoration: underline dotted;
    text-underline-offset: 3px;
  }
`

const ARTICLE_MAP: Record<string, ArticleStyle> = {
  // ── Definite articles ──────────────────────────────────────────
  'der ':   MASC,
  'der':    AMBIGUOUS,  // nom.masc OR dat/gen.fem — dotted underline
  'die ':   FEM,
  'die':    FEM,
  'das ':   NEUT,
  'das':    NEUT,
  'den ':   MASC,
  'den':    MASC,
  'dem ':   MASC_NEUT,
  'dem':    MASC_NEUT,
  'des ':   MASC_NEUT,
  'des':    MASC_NEUT,

  // ── Indefinite articles ────────────────────────────────────────
  'ein ':   MASC_NEUT,
  'ein':    MASC_NEUT,
  'eine ':  FEM,
  'eine':   FEM,
  'einen':  MASC,
  'einem':  MASC_NEUT,
  'einer':  FEM,
  'eines':  MASC_NEUT,

  // ── kein ──────────────────────────────────────────────────────
  'kein ':  MASC_NEUT,
  'kein':   MASC_NEUT,
  'keine ': FEM,
  'keine':  FEM,
  'keinen': MASC,
  'keinem': MASC_NEUT,
  'keiner': FEM,
  'keines': MASC_NEUT,
}

const ARTICLE_KEYS = Object.keys(ARTICLE_MAP).sort((a, b) => b.length - a.length)

function getArticleMatch(text: string): { style: ArticleStyle; articleLen: number } | null {
  const lower = text.toLowerCase()
  for (const key of ARTICLE_KEYS) {
    const keyTrimmed = key.trimEnd()
    const isPrefix = lower.startsWith(key.toLowerCase())
    const isExact  = lower === keyTrimmed.toLowerCase()
    if (isPrefix || isExact) {
      const style = ARTICLE_MAP[key]
      if (style) return { style, articleLen: keyTrimmed.length }
    }
  }
  return null
}

function GenderedCell({ text }: { text: string }) {
  const match = getArticleMatch(text)
  if (!match) return <>{text}</>

  const article = text.slice(0, match.articleLen)
  const rest    = text.slice(match.articleLen)

  if (match.style.kind === 'ambiguous') {
    return (
      <>
        <span className="da-ambiguous font-semibold">{article}</span>
        {rest}
      </>
    )
  }

  return (
    <>
      <span className={`da-${match.style.id} font-semibold`}>{article}</span>
      {rest}
    </>
  )
}

function Tokens({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((t, i) =>
        t.kind === 'text'
          ? <span key={i}>{t.value}</span>
          : <GermanWord key={i} data={t.data} />
      )}
    </>
  )
}

export function ChapterRenderer({ lines, fontSize }: { lines: ParsedLine[]; fontSize: number }) {
  return (
    <div style={{ fontSize }} className="font-mono">
      <style>{STYLE_CSS}</style>

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
                    <th key={j} className="text-left py-2 px-3 font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider text-[10px]">
                      {h}
                    </th>
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