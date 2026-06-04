export type Novel = {
  id: string
  title: string
  author: string
  description: string
  genre: string[]
  coverImage: string | null
  totalChapters: number
  contentFolder: string
  type: 'md'
}

const novels: Novel[] = [
  {
    id: 'ugly-duckling',
    title: 'The Ugly Duckling',
    author: 'Hans Christian Andersen',
    description: 'A short classic about belonging and transformation. Simple, repetitive vocabulary - perfect for learning German through reading.',
    genre: ['Classic', 'Demo'],
    coverImage: '/covers/ugly-duckling.jpg',
    totalChapters: 1,
    contentFolder: 'ugly-duckling',
    type: 'md',
  },
  {
    id: 'shadow-slave',
    title: 'Shadow Slave',
    author: 'Guiltythree',
    description: 'A young man infected by the Nightmare Spell must survive his First Trial and carve a path through a world transformed by darkness.',
    genre: ['Fantasy', 'Action'],
    coverImage: '/covers/shadow-slave.jpg',
    totalChapters: 500,
    contentFolder: 'shadow-slave',
    type: 'md',
  },
  {
    id: 'a1-glossary',
    title: 'Goethe A1 German Reference',
    author: 'Goethe-Institut',
    description: 'Official A1 vocabulary, grammar tables, verb conjugations, and topic glossaries. Complete reference for Start Deutsch 1.',
    genre: ['Reference', 'Grammar'],
    coverImage: '/covers/a1-glossary.png',
    totalChapters: 1,
    contentFolder: 'a1-glossary',
    type: 'md',
  },
]

export default novels
export function getNovel(id: string): Novel | undefined {
  return novels.find(n => n.id === id)
}
