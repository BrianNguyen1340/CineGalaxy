import { Document, model, Schema, Types } from 'mongoose'

export type MovieTicketType = Document & {
  readonly _id: Types.ObjectId
  totalPrice: number
  quantity: number
  datetime: Date
  showtime: Types.ObjectId
  customer: Types.ObjectId
  cashier: Types.ObjectId
}

const movieTicketSchema = new Schema<MovieTicketType>(
  {
    totalPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    datetime: {
      type: Date,
      required: true,
    },
    showtime: {
      type: Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cashier: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const movieTicketModel = model<MovieTicketType>(
  'MovieTicket',
  movieTicketSchema,
  'movie_ticket',
)
