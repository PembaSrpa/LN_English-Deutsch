export type ParagraphPair = {
  german: string
  english: string
}

export type ParsedParallelLine =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'paragraph'; data: ParagraphPair }
  | { kind: 'blank' }

function stripPrefix(line: string, prefixLength: number): string {
  return line.trim().slice(prefixLength).trim()
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
      result.push({ kind: 'heading', level: headingMatch[1].length, text: headingMatch[2].trim() })
      i++
      continue
    }

    if (/^DE:/i.test(trimmed)) {
      const german = stripPrefix(trimmed, 3)
      let english = ''
      if (i + 1 < lines.length && /^EN:/i.test(lines[i + 1].trim())) {
        english = stripPrefix(lines[i + 1].trim(), 3)
        i += 2
      } else {
        i += 1
      }
      result.push({ kind: 'paragraph', data: { german, english } })
      continue
    }

    i++
  }

  return result
}
