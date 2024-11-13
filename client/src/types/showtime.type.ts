import { CinemaType } from './cinema.type'
import { CinemaComplexType } from './cinemaComplex.type'
import { MovieType } from './movie.type'

export type ShowtimeType = {
  _id: string
  date: Date
  timeStart: Date
  timeEnd: Date
  movie: MovieType
  room: string
  cinema: CinemaType
  cinemaComplex: CinemaComplexType
}
