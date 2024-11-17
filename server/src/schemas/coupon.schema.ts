import { Document, model, Types, Schema } from 'mongoose'

export type CouponType = Document & {
  readonly _id: Types.ObjectId
  code: string
  discountPercentage: number
  expirationDate: Date
  isActive: boolean
  user: Types.ObjectId
}

const couponSchema = new Schema<CouponType>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 0,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

export const couponModel = model<CouponType>('Coupon', couponSchema)
