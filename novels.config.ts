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
    id: 'the-greatest-estate-developer',
    title: 'The Greatest Estate Developer',
    author: 'Yoo Ryeo Han',
    description: 'A washed-up architect gets a second chance in a fantasy world, building an empire one estate at a time.',
    genre: ['Fantasy', 'Romance', 'Reincarnation', 'Slice of Life', 'IELTS'],
    coverImage: '/covers/the-greatest-estate-developer.jpg',
    totalChapters: 408,
    contentFolder: 'the-greatest-estate-developer',
    type: 'md',
  },
{
    id: 'white-nights',
    title: 'White Nights',
    author: 'Fyodor Dostoevsky',
    description: 'A lonely dreamer falls for a young woman over four nights in Petersburg.',
    genre: ['Classic', 'Fiction', 'IELTS'],
    coverImage: '/covers/white-nights.jpg',
    totalChapters: 5,
    contentFolder: 'white-nights',
    type: 'md',
},
  {
    id: 'crime-and-punishment',
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    description: 'A destitute former student murders a pawnbroker in St. Petersburg and is consumed by guilt, paranoia, and the moral reckoning that follows.',
    genre: ['Classic', 'Fiction', 'Psychological', 'Literary Fiction','IELTS'],
    coverImage: '/covers/crime-and-punishment.jpg',
    totalChapters: 48,
    contentFolder: 'crime-and-punishment',
    type: 'md',
  },
  {
    id: 'brothers-karamazov',
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    description: 'Three brothers and their disreputable father collide over inheritance, faith, and desire in a Russian town shaken by patricide.',
    genre: ['Classic', 'Fiction', 'Philosophical', 'Drama','IELTS'],
    coverImage: '/covers/brothers-karamazov.jpg',
    totalChapters: 112,
    contentFolder: 'the-brothers-karamazov',
    type: 'md',
  },
  {
    id: 'ugly-duckling',
    title: 'The Ugly Duckling',
    author: 'Hans Christian Andersen',
    description: 'A short classic about belonging and transformation.',
    genre: ['Classic', 'Fairy Tale', 'Short Story', 'Demo'],
    coverImage: '/covers/ugly-duckling.jpg',
    totalChapters: 1,
    contentFolder: 'ugly-duckling',
    type: 'md',
  },
  {
    id: 'shadow-slave',
    title: 'Shadow Slave',
    author: 'Guiltythree',
    description: 'An impoverished, paranoid street rat gets magical powers, accidentally becomes the literal slave of a lethal blonde, and survives eldritch horrors on pure spite just to open a coffee shop.',
    genre: ['Fantasy', 'Action', 'Adventure', 'Dark Fantasy', 'Progression'],
    coverImage: '/covers/shadow-slave.jpg',
    totalChapters: 3000,
    contentFolder: 'shadow-slave',
    type: 'md',
  },
    {
    id: 'silent-patient',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description: 'A psychotherapist becomes obsessed with treating a woman who shot her husband and then never spoke another word again.',
    genre: ['Thriller', 'Mystery', 'Psychological', 'Drama'],
    coverImage: '/covers/the-silent-patient.jpg',
    totalChapters: 75,
    contentFolder: 'silent-patient',
    type: 'md',
  },
  {
    id: 'the-great-gatsby',
    title: 'Der große Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel of wealth, longing, and illusion in Jazz Age New York, annotated for German immersion reading.',
    genre: ['Classic', 'Fiction', 'Literary Fiction', 'Tragedy'],
    coverImage: '/covers/the-great-gatsby.jpg',
    totalChapters: 9,
    contentFolder: 'the-great-gatsby',
    type: 'md',
},
  {
    id: 'a1-glossary',
    title: 'A1 German',
    author: 'Goethe',
    description: 'A1 vocabulary, grammar tables, verb conjugations, and topic glossaries.',
    genre: ['Reference', 'Grammar', 'Vocabulary', 'Study Guide'],
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