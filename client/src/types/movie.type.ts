import { GenreType } from "./genre.type"

export type MovieType = {
  readonly _id: string
  name: string
  slug: string
  description: string
  director: string
  releaseDate: Date
  duration: number
  poster: string
  banner: string
  trailer: string
  movieRating: string
  subtitle: string
  movieFormat: string
  genres: GenreType[]
  hidden: boolean
}
