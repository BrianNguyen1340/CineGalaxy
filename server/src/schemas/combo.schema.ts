import { Document, model, Types, Schema } from 'mongoose'

export type ComboType = Document & {
  readonly _id: Types.ObjectId
  name: string
  expiry: number
  products: Types.ObjectId[]
  image: string
}

const comboSchema = new Schema<ComboType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    expiry: {
      type: Number,
      required: true,
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
      required: true,
      validate: {
        validator: (array: Types.ObjectId[]) => array.length > 0,
        message: 'Products array must contain at least one product.',
      },
    },
    image: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

export const comboModel = model<ComboType>('Combo', comboSchema)
