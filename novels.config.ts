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
    description: 'A short classic about belonging and transformation.',
    genre: ['Classic', 'Demo'],
    coverImage: '/covers/ugly-duckling.jpg',
    totalChapters: 1,
    contentFolder: 'ugly-duckling',
    type: 'md',
  },
  // {
  // id: 'learn-how-to-meow',
  // title: 'Meow ?',
  // author: 'Pemba',
  // description: 'meow meow meow.',
  // genre: ['Cat'],
  // coverImage: '/covers/meow.jpg',
  // totalChapters: 7,
  // contentFolder: 'learn-how-to-meow',
  // type: 'md',
  // },
  {
    id: 'shadow-slave',
    title: 'Shadow Slave',
    author: 'Guiltythree',
    description: 'An impoverished, paranoid street rat gets magical powers, accidentally becomes the literal slave of a lethal blonde, and survives eldritch horrors on pure spite just to open a coffee shop.',
    genre: ['Fantasy', 'Action'],
    coverImage: '/covers/shadow-slave.jpg',
    totalChapters: 3000,
    contentFolder: 'shadow-slave',
    type: 'md',
  },
  {
    id: 'twisted-love',
    title: 'Twisted Love',
    author: 'Ana Huang',
    description: 'Ruthless businessman Alex Volkov has one rule: never fall in love. Then his best friend leaves him in charge of his innocent, sheltered sister, Ava Chen — and Alex\'s rule starts slipping.',
    genre: ['Romance', 'New Adult'],
    coverImage: '/covers/twisted-love.jpg',
    totalChapters: 43,
    contentFolder: 'twisted-love',
    type: 'md',
  },
  {
    id: 'a1-glossary',
    title: 'A1 German',
    author: 'Goethe',
    description: 'A1 vocabulary, grammar tables, verb conjugations, and topic glossaries.',
    genre: ['Reference', 'Grammar'],
    coverImage: '/covers/a1-glossary.png',
    totalChapters: 2,
    contentFolder: 'a1-glossary',
    type: 'md',
  },
]

export default novels
export function getNovel(id: string): Novel | undefined {
  return novels.find(n => n.id === id)
}
