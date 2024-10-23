import { Document, model, Schema, Types } from 'mongoose'

export type SeatType = Document & {
  number: number
  row: string
  type: string
  status: string
  price: number
  roomId: Types.ObjectId
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
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Standard', 'Vip', 'Kid', 'Couple'],
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Unavailable', 'Booked'],
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
  },
  { timestamps: true },
)

export const seatModel = model<SeatType>('Seat', seatSchema)
