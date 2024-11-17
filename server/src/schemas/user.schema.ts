import { Document, Schema, Types, model } from 'mongoose'

export type UserType = Document & {
  readonly _id: Types.ObjectId
  name: string
  email: string
  password: string
  phone: string
  gender: string
  address: string
  photoURL: string
  cart: {
    product: Types.ObjectId
    quantity: number
  }[]
  role: number
  isBlocked: boolean
  isVerified: boolean
  lastLogin: Date
  resetPasswordToken?: string
  resetPasswordExpiresAt?: Date
}

const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    photoURL: {
      type: String,
      trim: true,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    role: {
      type: Number,
      default: 3,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: {
      type: String,
      require: false,
    },
    resetPasswordExpiresAt: {
      type: Date,
      require: false,
    },
  },
  {
    timestamps: true,
  },
)

export const userModel = model<UserType>('User', userSchema)


