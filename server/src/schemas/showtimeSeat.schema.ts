import { Document, model, Types, Schema } from 'mongoose'

export type ShowtimeSeatType = Document & {
  readonly _id: Types.ObjectId
  seat: Types.ObjectId
  showtimeDetail: Types.ObjectId
  status: string
}

const showtimeSeatSchema = new Schema<ShowtimeSeatType>(
  {
    seat: {
      type: Schema.Types.ObjectId,
      ref: 'Seat',
      required: true,
      trim: true,
    },
    showtimeDetail: {
      type: Schema.Types.ObjectId,
      ref: 'Seat',
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
)

export const showtimeSeatModel = model('ShowtimeSeat', showtimeSeatSchema)
