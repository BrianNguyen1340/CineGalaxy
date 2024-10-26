import { Document, model, Schema, Types } from 'mongoose'

// *****************************************************************************

export type RoomType = Document & {
  name: string
  opacity: number
  status: string
  screen: string
  cinema: Types.ObjectId
}

const roomSchema = new Schema<RoomType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    opacity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['có sẵn', 'bảo trì'],
      required: true,
      trim: true,
    },
    screen: {
      type: String,
      enum: ['2D', '3D'],
      required: true,
      trim: true,
    },
    cinema: {
      type: Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
  },
  { timestamps: true },
)

export const roomModel = model<RoomType>('Room', roomSchema)
