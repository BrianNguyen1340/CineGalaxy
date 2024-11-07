import { Document, Schema, Types, model } from 'mongoose'

export type TVerificationCodeRegister = Document & {
  _id: Types.ObjectId
  email: string
  password: string
  name: string
  phone: string
  verificationToken: string
  verificationTokenExpiresAt: Date
  expiresAt: Date
  createdAt: Date
}

const verificationCodeRegisterSchema = new Schema<TVerificationCodeRegister>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      required: false,
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    verificationToken: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    verificationTokenExpiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
)

export const verificationCodeRegister = model<TVerificationCodeRegister>(
  'VerificationCodeRegister',
  verificationCodeRegisterSchema,
  'verification_code_register',
)
