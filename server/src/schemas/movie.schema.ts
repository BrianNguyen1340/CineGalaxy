import { Document, Schema, Types, model } from 'mongoose'

export type MovieType = Document & {
  readonly _id: Types.ObjectId
  name: string
  slug: string
  description: string
  director: string
  releaseDate: Date
  duration: number
  poster: string
  banner: string
  trailer: string
  movieRating: string
  subtitle: string
  movieFormat: string
  genres: Types.ObjectId[]
}

const movieSchema = new Schema<MovieType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
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
      required: true,
    },
    banner: {
      type: String,
      trim: true,
      required: true,
    },
    trailer: {
      type: String,
      required: true,
      trim: true,
    },
    movieRating: {
      type: String,
      enum: [],
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      enum: ['Thuyết minh', 'Phụ đề', 'Lồng tiếng'],
      required: true,
      trim: true,
    },
    movieFormat: {
      type: String,
      enum: ['2D', '3D'],
      required: true,
      trim: true,
    },
    genres: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Genre',
    },
  },
  {
    timestamps: true,
  },
)

export const movieModel = model<MovieType>('Movie', movieSchema)
