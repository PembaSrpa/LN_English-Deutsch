import type { ParsedLine, Token } from './parseChapter'
import type { ParsedParallelLine } from './parseParallelChapter'
import type { LanguageMode } from './settings'

function tokensToText(tokens: Token[], substituteAnnotated: boolean): string {
  return tokens
    .map((t) => (t.kind === 'annotated' ? (substituteAnnotated ? t.data.translation : t.data.word) : t.value))
    .join('')
    .trim()
}

function extractNarrationSegments(lines: ParsedLine[], substituteAnnotated: boolean): string[] {
  const segments: string[] = []
  for (const line of lines) {
    if (line.kind !== 'paragraph' && line.kind !== 'heading') continue
    const text = tokensToText(line.tokens, substituteAnnotated)
    if (text) segments.push(text)
  }
  return segments
}

export function extractMdNarration(lines: ParsedLine[]): string[] {
  return extractNarrationSegments(lines, true)
}

export function extractPlainNarration(lines: ParsedLine[]): string[] {
  return extractNarrationSegments(lines, false)
}

export function extractParallelNarration(lines: ParsedParallelLine[], languageMode: LanguageMode): string[] | null {
  if (languageMode === 'both') return null
  const segments: string[] = []
  for (const line of lines) {
    if (line.kind === 'heading') {
      if (line.text) segments.push(line.text)
      continue
    }
    if (line.kind !== 'paragraph') continue
    const text = languageMode === 'de' ? line.data.german : line.data.english
    if (text) segments.push(text)
  }
  return segments
}
