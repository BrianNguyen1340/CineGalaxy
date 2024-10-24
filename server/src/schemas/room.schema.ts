import { Document, model, Schema, Types } from 'mongoose'

export type RoomType = Document & {
  name: string
  opacity: number
  status: string
  screen: string
  cinemaId: Types.ObjectId
}

const roomSchema = new Schema<RoomType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    opacity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'maintenance'],
      required: true,
      trim: true,
    },
    screen: {
      type: String,
      enum: ['2D', '3D'],
      required: true,
      trim: true,
    },
    cinemaId: {
      type: Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
  },
  { timestamps: true },
)

export const roomModel = model<RoomType>('Room', roomSchema)
