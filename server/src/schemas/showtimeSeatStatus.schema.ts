import { Document, model, Types, Schema } from 'mongoose'

export type ShowtimeSeatStatusType = Document & {
  readonly _id: Types.ObjectId
  seat: Types.ObjectId
  showtime: Types.ObjectId
  status: string
}

const showtimeSeatStatusSchema = new Schema<ShowtimeSeatStatusType>(
  {
    seat: {
      type: Schema.Types.ObjectId,
      ref: 'Seat',
      required: true,
    },
    showtime: {
      type: Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'booked'],
      required: true,
    },
  },
  { timestamps: true },
)

export const showtimeSeatStatusModel = model(
  'ShowtimeSeatStatus',
  showtimeSeatStatusSchema,
)
