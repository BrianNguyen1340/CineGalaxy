import { Document, Schema, Types, model } from 'mongoose'

export type MovieType = Document & {
  _id: Types.ObjectId
  name: string
  description: string
  director: string
  releaseDate: Date
  age: number
  duration: number
  poster: string
  trailer: string
  // movieVersionId: Types.ObjectId
  movieRating: string
  genreId: Types.ObjectId
}

const movieSchema = new Schema<MovieType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    director: {
      type: String,
      required: true,
      trim: true,
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
      trim: true,
    },
    trailer: {
      type: String,
      required: true,
      trim: true,
    },
    // movieVersionId: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'MovieVersion',
    // },
    movieRating: {
      type: String,
      required: true,
      trim: true,
    },
    genreId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Genre',
    },
  },
  {
    timestamps: true,
  },
)

export const movieModel = model<MovieType>('Movie', movieSchema)
