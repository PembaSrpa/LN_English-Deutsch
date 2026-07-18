'use client'
import { useState } from 'react'
import type { QuizQuestion } from '@/lib/parseGradedChapter'

export function QuizSection({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})

  if (questions.length === 0) return null

  const answeredCount = Object.keys(answers).length
  const correctCount = questions.filter((q) => answers[q.number] === q.correctLetter).length

  const selectAnswer = (questionNumber: number, letter: string) => {
    setAnswers((prev) => {
      if (prev[questionNumber]) return prev
      return { ...prev, [questionNumber]: letter }
    })
  }

  return (
    <div className="mt-6 mb-10 rounded-xl border border-neutral-600 bg-neutral-750/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[0.625rem] uppercase tracking-widest text-neutral-400">Übung</div>
        {answeredCount > 0 && (
          <div className="text-xs font-semibold text-neutral-200 tabular-nums">
            {correctCount}/{questions.length} correct
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {questions.map((q) => {
          const picked = answers[q.number]
          return (
            <div key={q.number}>
              <div className="text-sm font-medium text-neutral-100 mb-2">
                {q.number}. {q.question}
              </div>
              <div className="flex flex-col gap-1.5">
                {q.options.map((opt) => {
                  const isPicked = picked === opt.letter
                  const isCorrect = opt.letter === q.correctLetter
                  let stateClass = 'border-neutral-600 text-neutral-200 hover:border-neutral-500'
                  if (picked) {
                    if (isCorrect) stateClass = 'border-green-500 bg-green-500/10 text-green-400'
                    else if (isPicked) stateClass = 'border-red-500 bg-red-500/10 text-red-400'
                    else stateClass = 'border-neutral-700 text-neutral-500'
                  }
                  return (
                    <button
                      key={opt.letter}
                      onClick={() => selectAnswer(q.number, opt.letter)}
                      disabled={!!picked}
                      className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors touch-manipulation ${stateClass}`}
                    >
                      <span className="font-semibold mr-1.5">{opt.letter})</span>
                      {opt.text}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
