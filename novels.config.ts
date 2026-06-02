export type Novel = {
  id: string
  title: string
  author: string
  description: string
  genre: string[]
  coverImage: string | null
  totalChapters: number
  contentFolder: string
}

const novels: Novel[] = [
  {
    id: 'shadow-slave',
    title: 'Shadow Slave',
    author: 'Guiltythree',
    description:
      'A young man infected by the Nightmare Spell must survive his First Trial and carve a path through a world transformed by ancient, unknowable darkness.',
    genre: ['Fantasy', 'Action'],
    coverImage: null,
    totalChapters: 500,
    contentFolder: 'shadow-slave',
  },
  {
    id: 'demo',
    title: 'Die Stille Stadt',
    author: 'Demo Author',
    description:
      'A showcase novel demonstrating the Schatten Lesen reading experience — annotated German vocabulary, hover translations, and gradual immersion across five chapters.',
    genre: ['Demo', 'Literary'],
    coverImage: null,
    totalChapters: 5,
    contentFolder: 'demo',
  },
]

export default novels

export function getNovel(id: string): Novel | undefined {
  return novels.find((n) => n.id === id)
}
