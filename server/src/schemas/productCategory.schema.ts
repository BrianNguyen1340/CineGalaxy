import { Document, model, Types, Schema } from 'mongoose'

export type ProductCategoryType = Document & {
  readonly _id: Types.ObjectId
  name: string
}

const productCategorySchema = new Schema<ProductCategoryType>(
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

export const productCategoryModel = model<ProductCategoryType>(
  'ProductCategory',
  productCategorySchema,
  'product_categories',
)
