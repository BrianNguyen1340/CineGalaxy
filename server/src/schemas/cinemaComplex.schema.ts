import { Document, Schema, Types, model } from 'mongoose'

export type TCinemaComplex = Document & {
    _id: Types.ObjectId
    name: string
}

const cinemaComplexSchema = new Schema<TCinemaComplex>(
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

export const cinemaComplexModel = model<TCinemaComplex>(
    'CinemaComplex',
    cinemaComplexSchema,
    'cinema_complex',
)
