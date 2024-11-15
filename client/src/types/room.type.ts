import { CinemaType } from './cinema.type'

export type RoomType = {
  readonly _id: string
  name: string
  opacity: number
  status: string
  screen: string
  cinema: CinemaType
}
