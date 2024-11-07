import { Document, Schema, Types, model } from 'mongoose'

export type UserType = Document & {
  _id: Types.ObjectId
  email: string
  name: string
  password: string
  phone: string
  gender?: string
  address?: string
  photoURL?: string
  role: number
  isBlocked: boolean
  isVerified: boolean
  lastLogin: Date
  resetPasswordToken?: string
  resetPasswordExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserType>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
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
    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: Number,
      default: 3,
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
