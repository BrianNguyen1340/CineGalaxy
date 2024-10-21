import { Document, Schema, Types, model } from 'mongoose'

export type CinemaComplexType = Document & {
  _id: Types.ObjectId
  name: string
}

const cinemaComplexSchema = new Schema<CinemaComplexType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

export const cinemaComplexModel = model<CinemaComplexType>(
  'CinemaComplex',
  cinemaComplexSchema,
  'cinema_complex',
)
