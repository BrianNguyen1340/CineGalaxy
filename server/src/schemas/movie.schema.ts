import { Document, Schema, Types, model } from 'mongoose'

export type MovieType = Document & {
  _id: Types.ObjectId
  name: string
  description: string
  director: string
  releaseDate: Date
  duration: number
  poster: string
  trailer: string
  movieRating: number
  subtitle: string
  movieFormat: string
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
    duration: {
      type: Number,
      required: true,
    },
    poster: {
      type: String,
      trim: true,
    },
    trailer: {
      type: String,
      required: true,
      trim: true,
    },
    movieRating: {
      type: Number,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      // enum: ['Thuyết minh', 'Phụ đề', 'Lồng tiếng'],
      required: true,
      trim: true,
    },
    movieFormat: {
      type: String,
      // enum: ['2D', '3D'],
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
