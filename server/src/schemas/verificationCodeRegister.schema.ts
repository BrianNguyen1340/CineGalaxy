import { Document, Schema, model } from 'mongoose'

export type TVerificationCodeRegister = Document & {
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
            required: [true, 'email is required!'],
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'password is required!'],
            trim: true,
        },
        phone: {
            required: false,
            type: String,
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'name is required!'],
            trim: true,
        },
        verificationToken: {
            type: String,
            required: [true, 'verificationToken is required!'],
            trim: true,
            unique: true,
        },
        verificationTokenExpiresAt: {
            type: Date,
            required: [true, 'verificationTokenExpiresAt is required!'],
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
