import { GermanWord } from './GermanWord'
import type { ParsedLine, Token } from '@/lib/parseChapter'

type ArticleStyle =
  | { kind: 'solid';    id: string; light: string; dark: string }
  | { kind: 'gradient'; id: string; lightFrom: string; lightTo: string; darkFrom: string; darkTo: string }

const MASC:      ArticleStyle = { kind: 'solid',    id: 'masc',     light: '#1d4ed8', dark: '#60a5fa' }
const FEM:       ArticleStyle = { kind: 'solid',    id: 'fem',      light: '#c2003f', dark: '#ff6b9d' }
const NEUT:      ArticleStyle = { kind: 'solid',    id: 'neut',     light: '#047857', dark: '#34d399' }
const MASC_NEUT: ArticleStyle = { kind: 'gradient', id: 'mascneut', lightFrom: '#1d4ed8', lightTo: '#047857', darkFrom: '#60a5fa', darkTo: '#34d399' }
const MASC_FEM:  ArticleStyle = { kind: 'gradient', id: 'mascfem',  lightFrom: '#1d4ed8', lightTo: '#c2003f', darkFrom: '#60a5fa', darkTo: '#ff6b9d' }

// One global <style> block — injected once at the top of ChapterRenderer
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
  .da-mascfem {
    background: linear-gradient(90deg,#1d4ed8,#c2003f);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .dark .da-mascfem {
    background: linear-gradient(90deg,#60a5fa,#ff6b9d);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
`

// ─── Article / possessive map ────────────────────────────────────────────────
//
// Keys with a trailing space  → prefix match  (e.g. "der Mann")
// Keys without trailing space → exact match   (e.g. standalone "der" in a table cell)
//
// Standalone "der" is MASC_FEM gradient because in declension tables it appears
// as both nominative masculine AND dative/genitive feminine — the gradient signals
// this double duty to the learner.

const ARTICLE_MAP: Record<string, ArticleStyle> = {
  // ── Definite articles ──────────────────────────────────────────────────────
  'der ':   MASC,
  'der':    MASC_FEM,   // nom.masc OR dat/gen.fem
  'die ':   FEM,
  'die':    FEM,
  'das ':   NEUT,
  'das':    NEUT,
  'den ':   MASC,       // acc.masc / dat.plural
  'den':    MASC,
  'dem ':   MASC_NEUT,
  'dem':    MASC_NEUT,
  'des ':   MASC_NEUT,
  'des':    MASC_NEUT,

  // ── Indefinite articles ────────────────────────────────────────────────────
  'ein ':   MASC_NEUT,
  'ein':    MASC_NEUT,
  'eine ':  FEM,
  'eine':   FEM,
  'einen':  MASC,
  'einem':  MASC_NEUT,
  'einer':  FEM,
  'eines':  MASC_NEUT,

  // ── kein ──────────────────────────────────────────────────────────────────
  'kein ':  MASC_NEUT,
  'kein':   MASC_NEUT,
  'keine ': FEM,
  'keine':  FEM,
  'keinen': MASC,
  'keinem': MASC_NEUT,
  'keiner': FEM,
  'keines': MASC_NEUT,

  // ── mein ──────────────────────────────────────────────────────────────────
  'mein ':  MASC_NEUT,
  'mein':   MASC_NEUT,
  'meine ': FEM,
  'meine':  FEM,
  'meinen': MASC,
  'meinem': MASC_NEUT,
  'meiner': FEM,
  'meines': MASC_NEUT,

  // ── dein ──────────────────────────────────────────────────────────────────
  'dein ':  MASC_NEUT,
  'dein':   MASC_NEUT,
  'deine ': FEM,
  'deine':  FEM,
  'deinen': MASC,
  'deinem': MASC_NEUT,
  'deiner': FEM,
  'deines': MASC_NEUT,

  // ── sein ──────────────────────────────────────────────────────────────────
  'sein ':  MASC_NEUT,
  'sein':   MASC_NEUT,
  'seine ': FEM,
  'seine':  FEM,
  'seinen': MASC,
  'seinem': MASC_NEUT,
  'seiner': FEM,
  'seines': MASC_NEUT,

  // ── ihr / ihre (her / their) ───────────────────────────────────────────────
  'ihr ':   MASC_NEUT,
  'ihr':    MASC_NEUT,
  'ihre ':  FEM,
  'ihre':   FEM,
  'ihren':  MASC,
  'ihrem':  MASC_NEUT,
  'ihrer':  FEM,
  'ihres':  MASC_NEUT,

  // ── unser ─────────────────────────────────────────────────────────────────
  'unser ':   MASC_NEUT,
  'unser':    MASC_NEUT,
  'unsere ':  FEM,
  'unsere':   FEM,
  'unseren':  MASC,
  'unserem':  MASC_NEUT,
  'unserer':  FEM,
  'unseres':  MASC_NEUT,

  // ── euer / eure ───────────────────────────────────────────────────────────
  'euer ':  MASC_NEUT,
  'euer':   MASC_NEUT,
  'eure ':  FEM,
  'eure':   FEM,
  'euren':  MASC,
  'eurem':  MASC_NEUT,
  'eurer':  FEM,
  'eures':  MASC_NEUT,

  // ── Ihr / Ihre (formal Sie) — case-sensitive, checked separately ───────────
  'Ihr ':   MASC_NEUT,
  'Ihr':    MASC_NEUT,
  'Ihre ':  FEM,
  'Ihre':   FEM,
  'Ihren':  MASC,
  'Ihrem':  MASC_NEUT,
  'Ihrer':  FEM,
  'Ihres':  MASC_NEUT,
}

// Sorted longest-first so e.g. 'unsere' is tried before 'unser',
// 'seine' before 'sein', preventing short keys eating longer ones.
const ARTICLE_KEYS = Object.keys(ARTICLE_MAP).sort((a, b) => b.length - a.length)

function getArticleMatch(text: string): { style: ArticleStyle; articleLen: number } | null {
  const lower = text.toLowerCase()

  for (const key of ARTICLE_KEYS) {
    const keyTrimmed = key.trimEnd()

    // Formal "Ihr*" forms need a case-sensitive check so lowercase "ihr" (her)
    // doesn't accidentally match the formal "Ihr" entry.
    const isFormal     = key[0] === 'I' && key[1] === 'h' // Ihr, Ihre, Ihren…
    const textCompare  = isFormal ? text  : lower
    const keyCompare   = isFormal ? key   : key.toLowerCase()
    const keyTrimComp  = isFormal ? keyTrimmed : keyTrimmed.toLowerCase()

    const isPrefix = textCompare.startsWith(keyCompare)
    const isExact  = textCompare === keyTrimComp

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
  return (
    <span className={`da-${match.style.id} font-semibold`}>
      {article}
      <span className="font-normal text-neutral-800 dark:text-neutral-200">{rest}</span>
    </span>
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
      {/* Inject article colour styles once at the top */}
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