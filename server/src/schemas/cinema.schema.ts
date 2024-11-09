import { Document, Schema, Types, model } from 'mongoose'

export type CinemaType = Document & {
  readonly _id: Types.ObjectId
  name: string
  address: string
  phone: string
  email: string
  cinemaComplex: Types.ObjectId
}

const cinemaSchema = new Schema<CinemaType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    cinemaComplex: {
      type: Schema.Types.ObjectId,
      ref: 'CinemaComplex',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const cinemaModel = model<CinemaType>('Cinema', cinemaSchema)
