import { Document, model, Schema, Types } from 'mongoose'

export type TMovieCategory = Document & {
    _id: Types.ObjectId
    movieId: Types.ObjectId
    categoryId: Types.ObjectId
}

const movieCategorySchema = new Schema<TMovieCategory>(
    {
        movieId: {
            type: Schema.Types.ObjectId,
            ref: 'Movie',
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

export const movieCategoryModel = model<TMovieCategory>(
    'MovieCategory',
    movieCategorySchema,
    'movie_category',
)
