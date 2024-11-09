import { Document, Schema, Types, model } from 'mongoose'

export type MovieVersionType = Document & {
  readonly _id: Types.ObjectId
  movieId: Types.ObjectId
  versionId: Types.ObjectId
}

const movieVersionSchema = new Schema<MovieVersionType>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    versionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const movieVersionModel = model<MovieVersionType>(
  'MovieVersion',
  movieVersionSchema,
  'movie_version',
)
