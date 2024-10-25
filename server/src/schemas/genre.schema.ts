import { Document, model, Schema, Types } from 'mongoose'

// *****************************************************************************

export type GenreType = Document & {
  _id: Types.ObjectId
  name: string
}

const genreSchema = new Schema<GenreType>(
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

export const genreModel = model<GenreType>('Genre', genreSchema)
