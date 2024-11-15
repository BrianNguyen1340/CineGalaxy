import { Document, model, Types, Schema } from 'mongoose'

export type ProductType = Document & {
  readonly _id: Types.ObjectId
  name: string
  category: Types.ObjectId
  image: string
  price: number
  size: string
  description?: string
}

const productSchema = new Schema<ProductType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'ProductCategory',
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
      enum: ['Small', 'Medium', 'Large'],
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export const productModel = model<ProductType>('Product', productSchema)

// countInStock: number
// discount: number
// status: string
// createdBy: Types.ObjectId
// ratings: number
// reviews: {
//   user: Types.ObjectId
//   comment: string
//   rating: number
// }
// saleStartDate: Date
// saleEndDate: Date
// supplier: Types.ObjectId