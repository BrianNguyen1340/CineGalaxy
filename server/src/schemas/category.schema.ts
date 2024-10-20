import { Document, model, Schema, Types } from 'mongoose'

export type CategoryType = Document & {
    _id: Types.ObjectId
    name: string
}

const categorySchema = new Schema<CategoryType>(
    {
        name: {
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

export const categoryModel = model<CategoryType>('Category', categorySchema)
