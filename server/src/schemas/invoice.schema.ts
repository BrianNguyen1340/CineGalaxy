import { Document, model, Schema, Types } from 'mongoose'

export type InvoiceType = Document & {
  readonly _id: Types.ObjectId
  name: string
  totalPrice: number
  datetime: Date
  cinemaId: Types.ObjectId
  movieTicketId: Types.ObjectId
  serviceTicket: Types.ObjectId
}

const invoiceSchema = new Schema<InvoiceType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    datetime: {
      type: Date,
      required: true,
    },
    cinemaId: {
      type: Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
    serviceTicket: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceTicket',
      required: true,
    },
    movieTicketId: {
      type: Schema.Types.ObjectId,
      ref: 'MovieTicket',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const invoiceModel = model<InvoiceType>('Invoice', invoiceSchema)
