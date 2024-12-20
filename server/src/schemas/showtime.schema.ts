import { Document, Schema, Types, model } from 'mongoose'

export type ShowtimeType = Document & {
  readonly _id: Types.ObjectId
  date: Date
  timeStart: Date
  timeEnd: Date
  movie: Types.ObjectId
  room: Types.ObjectId
  cinema: Types.ObjectId
  cinemaComplex: Types.ObjectId
  hidden: boolean
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
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    cinema: {
      type: Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
    cinemaComplex: {
      type: Schema.Types.ObjectId,
      ref: 'CinemaComplex',
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const showtimeModel = model<ShowtimeType>('Showtime', showtimeSchema)
