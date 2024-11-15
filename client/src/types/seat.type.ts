import { RoomType } from './room.type'

export type SeatType = {
  readonly _id: string
  number: number
  row: string
  type: string
  price: number
  room: RoomType
}
