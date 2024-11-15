import { CinemaType } from './cinema.type'
import { CinemaComplexType } from './cinemaComplex.type'
import { MovieType } from './movie.type'
import { RoomType } from './room.type'

export type ShowtimeType = {
  readonly _id: string
  date: Date
  timeStart: Date
  timeEnd: Date
  movie: MovieType
  room: RoomType
  cinema: CinemaType
  cinemaComplex: CinemaComplexType
  hidden: boolean
}
