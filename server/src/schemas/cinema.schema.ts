import { Document, Schema, Types, model } from 'mongoose'

export type CinemaType = Document & {
  _id: Types.ObjectId
  name: string
  address: string
  phone: string
  email: string
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
  },
  {
    timestamps: true,
  },
)

export const cinemaModel = model<CinemaType>('Cinema', cinemaSchema)
