import { Document, model, Schema, Types } from 'mongoose'

export type SeatType = Document & {
  _id: Types.ObjectId
  number: number
  row: string
  type: string
  room: Types.ObjectId
}

const seatSchema = new Schema<SeatType>(
  {
    number: {
      type: Number,
      required: true,
      trim: true,
    },
    row: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Standard', 'Vip', 'Kid', 'Couple'],
      required: true,
      trim: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
  },
  { timestamps: true },
)

export const seatModel = model<SeatType>('Seat', seatSchema)
