'use client'
import { useMemo } from 'react'
import { GermanWord } from './GermanWord'
import { useWordBookmark } from './WordBookmarkContext'
import type { ParsedLine, Token } from '@/lib/parseChapter'

type ArticleStyle =
  | { kind: 'solid';    id: string; color: string }
  | { kind: 'gradient'; id: string; from: string; to: string }
  | { kind: 'ambiguous' }

const MASC:      ArticleStyle = { kind: 'solid',    id: 'masc',     color: '#60a5fa' }
const FEM:       ArticleStyle = { kind: 'solid',    id: 'fem',      color: '#f472b6' }
const NEUT:      ArticleStyle = { kind: 'solid',    id: 'neut',     color: '#34d399' }
const MASC_NEUT: ArticleStyle = { kind: 'gradient', id: 'mascneut', from: '#60a5fa', to: '#34d399' }
const AMBIGUOUS: ArticleStyle = { kind: 'ambiguous' }

const STYLE_CSS = `
  .da-masc     { color: #60a5fa }
  .da-fem      { color: #f472b6 }
  .da-neut     { color: #34d399 }
  .da-mascneut {
    background: linear-gradient(90deg,#60a5fa,#34d399);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .da-ambiguous {
    text-decoration: underline dotted;
    text-underline-offset: 3px;
  }
`

const ARTICLE_MAP: Record<string, ArticleStyle> = {
  'der ':   MASC,
  'der':    AMBIGUOUS,
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
  'ein ':   MASC_NEUT,
  'ein':    MASC_NEUT,
  'eine ':  FEM,
  'eine':   FEM,
  'einen':  MASC,
  'einem':  MASC_NEUT,
  'einer':  FEM,
  'eines':  MASC_NEUT,
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
    if (lower.startsWith(key.toLowerCase()) || lower === keyTrimmed.toLowerCase()) {
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
    return <><span className="da-ambiguous font-semibold">{article}</span>{rest}</>
  }
  return <><span className={`da-${match.style.id} font-semibold`}>{article}</span>{rest}</>
}

// Every word — plain or annotated — needs a stable, sequential index so a
// bookmarked word can be found again later. This used to be assigned via a
// single mutable counter object threaded through the whole render and
// incremented as JSX was built. That broke as soon as a bookmark was set:
// GermanWord/Tokens read the bookmark via context, so React can (and does)
// re-render just those consumers directly without re-invoking their parent
// ChapterRenderer. The shared counter object was never recreated for that
// standalone re-render, so it kept incrementing from wherever the previous
// full render had left it — silently shifting every word's index and
// breaking the highlight instead of just re-showing it.
//
// Fix: precompute how many word-slots each line contains (pure, no state),
// derive a starting offset per line, and give each Tokens instance its own
// starting number as a plain prop. Counting within a single Tokens call is
// still just a local variable — safe, because it's recreated from scratch
// on every call instead of being shared across calls.
function countTokenWords(tokens: Token[]): number {
  let n = 0
  for (const t of tokens) {
    if (t.kind === 'annotated') { n++; continue }
    for (const part of t.value.split(/(\s+)/)) {
      if (part === '' || /^\s+$/.test(part)) continue
      n++
    }
  }
  return n
}

function Tokens({
  tokens, novelId, novelTitle, chapter, startIndex, plainTextLang,
}: {

  tokens: Token[]
  novelId: string
  novelTitle: string
  chapter: number
  startIndex: number
  plainTextLang: 'de-DE' | 'en-GB'
}) {
  const { bookmark } = useWordBookmark()
  let local = startIndex

  return (
    <>
      {tokens.map((t, i) => {
        if (t.kind === 'annotated') {
          const wordIndex = local++
          return (
            <GermanWord
              key={i}
              data={t.data}
              novelId={novelId}
              novelTitle={novelTitle}
              chapter={chapter}
              wordIndex={wordIndex}
            />
          )
        }
        // Split plain text into words + whitespace so every word (even in
        // un-annotated novels) can be individually bookmarked.
        const parts = t.value.split(/(\s+)/)
        return (
          <span key={i}>
            {parts.map((part, j) => {
              if (part === '') return null
              if (/^\s+$/.test(part)) return part
              const wordIndex = local++
              const isBookmarked = !!bookmark
                && bookmark.novelId === novelId
                && bookmark.chapter === chapter
                && bookmark.wordIndex === wordIndex
              return (
                <span
                  key={j}
                  data-word-index={wordIndex}
                  data-word-text={part}
                  data-word-lang={plainTextLang}
                  className={isBookmarked ? 'word-bookmarked' : undefined}
                >
                  {part}
                </span>
              )
            })}
          </span>
        )
      })}
    </>
  )
}

export function ChapterRenderer({ lines, fontSize, fontFamily, novelId, novelTitle, chapter, plainTextLang = 'en-GB' }: { lines: ParsedLine[]; fontSize: number; fontFamily?: string; novelId: string; novelTitle: string; chapter: number; plainTextLang?: 'de-DE' | 'en-GB' }) {
  // One fixed starting word-index per line, computed once from the parsed
  // content itself (not from render side effects) so it can never drift
  // between renders. See the note above Tokens for why that matters.
  const lineStartIndices = useMemo(() => {
    const starts: number[] = []
    let running = 0
    for (const line of lines) {
      starts.push(running)
      if (line.kind === 'heading' || line.kind === 'paragraph') {
        running += countTokenWords(line.tokens)
      }
    }
    return starts
  }, [lines])

  return (
    <div style={{ fontSize, fontFamily }}>
      <style>{STYLE_CSS}</style>

      {lines.map((line, i) => {
        if (line.kind === 'blank') return <div key={i} className="h-3" />

        if (line.kind === 'divider') return (
          <div key={i} className="flex justify-center my-6 text-neutral-500 tracking-[0.5em] text-xs select-none">
            &middot;&middot;&middot;
          </div>
        )

        if (line.kind === 'heading') {
          if (line.level === 1) return (
            <h1 key={i} className="text-[1.4em] font-bold text-neutral-100 mb-5 mt-2">
              <Tokens tokens={line.tokens} novelId={novelId} novelTitle={novelTitle} chapter={chapter} startIndex={lineStartIndices[i]} plainTextLang={plainTextLang} />
            </h1>
          )
          if (line.level === 2) return (
            <h2 key={i} className="text-[1.1em] font-semibold text-neutral-200 mb-3 mt-8 pb-2 border-b border-neutral-600">
              <Tokens tokens={line.tokens} novelId={novelId} novelTitle={novelTitle} chapter={chapter} startIndex={lineStartIndices[i]} plainTextLang={plainTextLang} />
            </h2>
          )
          return (
            <h3 key={i} className="text-[1em] font-semibold text-neutral-200 mb-2 mt-4">
              <Tokens tokens={line.tokens} novelId={novelId} novelTitle={novelTitle} chapter={chapter} startIndex={lineStartIndices[i]} plainTextLang={plainTextLang} />
            </h3>
          )
        }

        if (line.kind === 'table') return (
          <div key={i} className="my-6 overflow-x-auto rounded-xl border border-neutral-600">
            <table className="w-full text-[0.8em] border-collapse">
              <thead className="bg-neutral-750">
                <tr>
                  {line.headers.map((h, j) => (
                    <th key={j} className="text-left py-2 px-3 font-semibold text-neutral-300 uppercase tracking-wider text-[0.8em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {line.rows.map((row, j) => (
                  <tr key={j} className="border-t border-neutral-600 even:bg-neutral-750">
                    {row.map((cell, k) => (
                      <td key={k} className="py-2 px-3 text-neutral-200">
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
          <p key={i} className="leading-[1.95] text-neutral-200 mb-4 text-[1em]">
            <Tokens tokens={line.tokens} novelId={novelId} novelTitle={novelTitle} chapter={chapter} startIndex={lineStartIndices[i]} plainTextLang={plainTextLang} />
          </p>
        )
      })}
    </div>
  )
}