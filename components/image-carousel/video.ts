export type Movie = {
  poster: string
  name: string
}

export const movies = [
  {
    poster: '/images/b-a/before-implant.webp',
    name: 'Airplane',
  },
  {
    poster: '/images/b-a/after-implant.webp',
    name: 'Family man',
  },
  {
    poster: '/images/b-a/beefore-ortodensi.webp',
    name: 'Laboratory',
  },
  {
    poster: '/images/b-a/after-ortodensi.webp',
    name: 'Napoleon',
  },
  {
    poster: '/images/b-a/before-jermgiri.webp',
    name: 'Person in Darkness',
  },
  {
    poster: '/images/b-a/after-jermgiri.webp',
    name: 'Scary Building',
  },
  {
    poster: '/images/b-a/before-masnooei.webp',
    name: 'Stars',
  },
  {
    poster: '/images/b-a/after-masnooei.webp',
    name: 'Stars',
  },
  {
    poster: '/images/b-a/before-tarmim.webp',
    name: 'Stars',
  },
  {
    poster: '/images/b-a/after-tarmim.webp',
    name: 'Stars',
  },
]

export const randomMoviesSet1 = movies
  .sort(() => Math.random() - 0.5)
  .concat(movies.sort(() => Math.random() - 0.5))
  .concat(movies.sort(() => Math.random() - 0.5))

export const randomMoviesSet2 = movies
  .sort(() => Math.random() - 0.5)
  .concat(movies.sort(() => Math.random() - 0.5))
  .concat(movies.sort(() => Math.random() - 0.5))
  .sort(() => Math.random() - 0.5)
