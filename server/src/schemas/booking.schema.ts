import { Schema, model, Document, Types } from 'mongoose'

export type BookingType = Document & {
  user: Types.ObjectId
  showtime: Types.ObjectId
  bookingDate: Date
  totalAmount: number
  seats: Types.ObjectId[]
  products: Types.ObjectId[]
  isPaid: boolean
  paymentMethod: string
  taxPrice: number
}

const BookingSchema = new Schema<BookingType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    showtime: {
      type: Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    seats: [
      {
        seat: {
          type: Schema.Types.ObjectId,
          ref: 'Seat',
          required: true,
        },
      },
    ],
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  },
)

export const bookingModel = model<BookingType>('Booking', BookingSchema)
