import { Document, model, Schema, Types } from 'mongoose'

export type ShowtimeDetailType = Document & {
  _id: Types.ObjectId
  room: Types.ObjectId
  showtime: Types.ObjectId
  seat: Types.ObjectId[]
}

const showtimeDetailSchema = new Schema<ShowtimeDetailType>(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    showtime: {
      type: Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    seat: {
      type: [Schema.Types.ObjectId],
      ref: 'Seat',
      required: true,
    },
  },
  { timestamps: true },
)

export const showtimeDetailModel = model<ShowtimeDetailType>(
  'ShowtimeDetail',
  showtimeDetailSchema,
)
