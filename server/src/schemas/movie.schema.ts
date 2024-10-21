import { Document, Schema, Types, model } from 'mongoose'

export type TMovie = Document & {
  _id: Types.ObjectId
  name: string
  description: string
  director: string
  releaseDate: Date
  age: number
  duration: number
  poster: string
  trailer: string
  movieVersionId: Types.ObjectId
  movieCategoryId: Types.ObjectId
}

const movieSchema = new Schema<TMovie>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    trailer: {
      type: String,
      required: true,
    },
    movieVersionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'MovieVersion',
    },
    movieCategoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'MovieCategory',
    },
  },
  {
    timestamps: true,
  },
)

export const movieModel = model<TMovie>('Movie', movieSchema)
