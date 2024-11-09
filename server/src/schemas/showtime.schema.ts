import { Document, Schema, Types, model } from 'mongoose'

export type ShowtimeType = Document & {
  _id: Types.ObjectId
  date: Date
  timeStart: Date
  timeEnd: Date
  movie: Types.ObjectId
  cinema: Types.ObjectId
  room: Types.ObjectId
}

const showtimeSchema = new Schema<ShowtimeType>(
  {
    date: {
      type: Date,
      required: true,
    },
    timeStart: {
      type: Date,
      required: true,
    },
    timeEnd: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
)

export const showtimeModel = model<ShowtimeType>('Showtime', showtimeSchema)
