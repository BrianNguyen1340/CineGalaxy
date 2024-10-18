import { Document, Schema, Types, model } from 'mongoose'

export type TMovieVersion = Document & {
    _id: Types.ObjectId
    movieId: Types.ObjectId
    versionId: Types.ObjectId
}

const movieVersionSchema = new Schema<TMovieVersion>(
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

export const movieVersionModel = model<TMovieVersion>(
    'MovieVersion',
    movieVersionSchema,
    'movie_version',
)
