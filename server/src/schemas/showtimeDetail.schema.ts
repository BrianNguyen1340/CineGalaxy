import { Document, model, Schema, Types } from 'mongoose'

export type ShowtimeDetailType = Document & {
  readonly _id: Types.ObjectId
  room: Types.ObjectId
  showtime: Types.ObjectId
  seat: Types.ObjectId[]
  movie: Types.ObjectId
  cinema: Types.ObjectId
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
    movie: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    cinema: {
      type: Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
    seat: [
      {
        seat: {
          type: Schema.Types.ObjectId,
          ref: 'Seat',
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
)

export const showtimeDetailModel = model<ShowtimeDetailType>(
  'ShowtimeDetail',
  showtimeDetailSchema,
)
