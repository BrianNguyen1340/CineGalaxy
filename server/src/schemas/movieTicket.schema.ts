import { Document, model, Schema, Types } from 'mongoose'

export type TMovieTicket = Document & {
    _id: Types.ObjectId
    totalPrice: number
    quantity: number
    datetime: Date
    showtimeId: Types.ObjectId
    customerId: Types.ObjectId
    cashierId: Types.ObjectId
}

const movieTicketSchema = new Schema<TMovieTicket>(
    {
        totalPrice: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        datetime: {
            type: Date,
            required: true,
        },
        showtimeId: {
            type: Schema.Types.ObjectId,
            ref: 'Showtime',
            required: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cashierId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

export const movieTicketModel = model<TMovieTicket>(
    'MovieTicket',
    movieTicketSchema,
    'movie_ticket',
)
