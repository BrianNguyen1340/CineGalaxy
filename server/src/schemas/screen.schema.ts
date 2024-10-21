import { Document, model, Schema, Types } from 'mongoose'

export type TScreen = Document & {
  name: string
  opacity: number
  cinemaId: Types.ObjectId
}

const screenSchema = new Schema<TScreen>(
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
    cinemaId: {
      type: Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
  },
  { timestamps: true },
)

const screenModel = model<TScreen>('Screen', screenSchema)

export default screenModel
