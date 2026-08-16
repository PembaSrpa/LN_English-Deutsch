import { parseChapter, type ParsedLine } from './parseChapter'

export type VocabEntry = {
  term: string
  meaning: string
}

export type QuizOption = {
  letter: string
  text: string
}

export type QuizQuestion = {
  number: number
  question: string
  options: QuizOption[]
  correctLetter: string
}

export type ParsedGradedChapter = {
  storyLines: ParsedLine[]
  vocabulary: VocabEntry[]
  quiz: QuizQuestion[]
}

function parseVocabulary(raw: string): VocabEntry[] {
  const pieces = raw.split(/,\s+/)
  const entries: VocabEntry[] = []
  for (const piece of pieces) {
    const trimmed = piece.trim()
    if (!trimmed) continue
    const idx = trimmed.indexOf(':')
    if (idx === -1) {
      if (entries.length > 0) {
        entries[entries.length - 1].meaning += `, ${trimmed}`
      } else {
        entries.push({ term: trimmed, meaning: '' })
      }
      continue
    }
    entries.push({
      term: trimmed.slice(0, idx).trim(),
      meaning: trimmed.slice(idx + 1).trim(),
    })
  }
  return entries
}

function parseQuiz(raw: string): QuizQuestion[] {
  const solutionsMatch = raw.match(/\*\*L[öo]sungen:\*\*\s*(.+)/i)
  const solutions = new Map<number, string>()
  if (solutionsMatch) {
    for (const pair of solutionsMatch[1].split(',')) {
      const m = pair.trim().match(/^(\d+)\s*([a-z])$/i)
      if (m) solutions.set(parseInt(m[1], 10), m[2].toLowerCase())
    }
  }

  const questions: QuizQuestion[] = []
  const questionRe = /\*\*(\d+)\.\s*(.+?)\*\*\n((?:[a-z]\)[^\n]*\n?)+)/gi
  let match: RegExpExecArray | null
  while ((match = questionRe.exec(raw)) !== null) {
    const number = parseInt(match[1], 10)
    const question = match[2].trim()
    const options: QuizOption[] = []
    const optionRe = /^([a-z])\)\s*(.+)$/gim
    let optMatch: RegExpExecArray | null
    while ((optMatch = optionRe.exec(match[3])) !== null) {
      options.push({ letter: optMatch[1].toLowerCase(), text: optMatch[2].trim() })
    }
    questions.push({
      number,
      question,
      options,
      correctLetter: solutions.get(number) ?? options[0]?.letter ?? 'a',
    })
  }
  return questions
}

// Every graded chapter source file opens with "# Title\n\n---\n\n" — a
// leftover scene-divider marker right under the heading. Rendered as-is it
// stacks the heading's own bottom margin with the divider's large top/bottom
// margins and the blank-line spacers on either side of it, producing a huge
// gap before the story actually starts. It carries no meaning here (unlike
// mid-chapter "---" scene breaks), so it's stripped, leaving a single blank
// line between title and first paragraph — matching every other novel type.
function stripLeadingTitleDivider(text: string): string {
  return text.replace(/^(#\s[^\n]*\n)[ \t]*\n-{3,}[ \t]*\n[ \t]*\n/, '$1\n')
}

export function parseGradedChapter(raw: string): ParsedGradedChapter {
  const normalized = stripLeadingTitleDivider(raw.replace(/\r\n/g, '\n'))

  const vocabIndex = normalized.search(/\*\*Vokabeln\*\*/i)
  const exerciseIndex = normalized.search(/##\s*[UÜ]bung/i)

  const storyRaw = vocabIndex === -1 ? normalized : normalized.slice(0, vocabIndex)
  const vocabRaw = vocabIndex === -1
    ? ''
    : normalized.slice(vocabIndex, exerciseIndex === -1 ? undefined : exerciseIndex)
  const quizRaw = exerciseIndex === -1 ? '' : normalized.slice(exerciseIndex)

  const storyLines = parseChapter(storyRaw)

  const vocabText = vocabRaw
    .replace(/\*\*Vokabeln\*\*/i, '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && l !== '---')
    .join(' ')
  const vocabulary = vocabText ? parseVocabulary(vocabText) : []

  const quiz = parseQuiz(quizRaw)

  return { storyLines, vocabulary, quiz }
}
