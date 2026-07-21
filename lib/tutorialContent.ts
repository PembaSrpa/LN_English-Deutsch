export type NovelType = 'md' | 'graded' | 'parallel'

export type TutorialTab = {
  id: string
  label: string
  body: string[]
}

const BOOKMARK_TAB: TutorialTab = {
  id: 'bookmark',
  label: 'Bookmarks',
  body: [
    'Tap the pencil icon in the header to arm bookmark mode.',
    'Then tap any word or paragraph to save it as your bookmark for this novel.',
    'Tap the pencil again to cancel without picking anything.',
  ],
}

const NARRATION_TAB: TutorialTab = {
  id: 'narration',
  label: 'Narration',
  body: [
    'Tap the speaker icon in the header to arm word narration.',
    'Then tap any word or paragraph to hear it spoken aloud.',
    'Open Settings and use the Listen controls to play, pause, or stop narration for the whole chapter.',
  ],
}

export const DEVICE_VOICE_CAVEAT = 'If your device has no German voice installed, German words may sound off or come out in an English accent.'

const ANNOTATION_TAB: TutorialTab = {
  id: 'annotation',
  label: 'Annotation',
  body: [
    'German words are colored by grammatical type as you read.',
    'Switch between Annotate and Reveal mode in Settings.',
    'Reveal mode shows the English translation directly. Tap a word to flip it back to German.',
  ],
}

const LANGUAGE_TAB: TutorialTab = {
  id: 'language',
  label: 'Language',
  body: [
    'Open Settings and choose English, German, or Both for this chapter.',
    'In Both mode, tap any paragraph to flip it between languages.',
    'Full chapter narration only works in a fixed English or German mode, not Both.',
  ],
}

const VOCAB_TAB: TutorialTab = {
  id: 'vocab',
  label: 'Vocab & Quiz',
  body: [
    'Each chapter ends with a vocabulary list of the German words used in the story.',
    'Test yourself with the quiz below the vocabulary list.',
  ],
}

export function getTutorialTabs(novelType: NovelType, showAnnotationTab: boolean = true): TutorialTab[] {
  if (novelType === 'md') {
    return showAnnotationTab ? [BOOKMARK_TAB, NARRATION_TAB, ANNOTATION_TAB] : [BOOKMARK_TAB, NARRATION_TAB]
  }
  if (novelType === 'graded') return [BOOKMARK_TAB, NARRATION_TAB, VOCAB_TAB]
  return [BOOKMARK_TAB, NARRATION_TAB, LANGUAGE_TAB]
}
