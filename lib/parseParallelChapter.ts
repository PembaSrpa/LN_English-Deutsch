export type SentencePair = {
  german: string
  english: string
}

export type ParallelToken =
  | { kind: 'text'; value: string }
  | { kind: 'sentence'; data: SentencePair }

export type ParsedParallelLine =
  | { kind: 'heading'; level: number; tokens: ParallelToken[] }
  | { kind: 'paragraph'; tokens: ParallelToken[] }
  | { kind: 'blank' }

const SENTENCE_PAIR_RE = /\{\{([^|{}]+)\|\|\|([^{}]+)\}\}/g

function tokenizeLine(line: string): ParallelToken[] {
  const tokens: ParallelToken[] = []
  let lastIndex = 0
  SENTENCE_PAIR_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = SENTENCE_PAIR_RE.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: 'text', value: line.slice(lastIndex, match.index) })
    }
    tokens.push({
      kind: 'sentence',
      data: {
        german: match[1].trim(),
        english: match[2].trim(),
      },
    })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < line.length) {
    tokens.push({ kind: 'text', value: line.slice(lastIndex) })
  }
  return tokens
}

export function parseParallelChapter(raw: string): ParsedParallelLine[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const result: ParsedParallelLine[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (/^Title:/i.test(trimmed) || /^Target:/i.test(trimmed)) {
      i++
      continue
    }

    if (trimmed === '') {
      result.push({ kind: 'blank' })
      i++
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      result.push({
        kind: 'heading',
        level: headingMatch[1].length,
        tokens: tokenizeLine(headingMatch[2]),
      })
      i++
      continue
    }

    result.push({ kind: 'paragraph', tokens: tokenizeLine(line) })
    i++
  }

  return result
}
