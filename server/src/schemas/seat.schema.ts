import { Document, model, Schema, Types } from 'mongoose'

export type SeatType = Document & {
  _id: Types.ObjectId
  number: number
  row: string
  type: string
  status: string
  price: number
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
    status: {
      type: String,
      enum: ['Available', 'Unavailable', 'Booked'],
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

export const seatModel = model<SeatType>('Seat', seatSchema)
