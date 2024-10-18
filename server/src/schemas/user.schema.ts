import { Document, Schema, Types, model } from 'mongoose'

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
}

export type AddressType = {
    street: string
    ward?: string
    district: string
    city: string
    zipCode?: string
}

const addressSchema = new Schema<AddressType>({
    street: { type: String, required: false },
    ward: { type: String, required: false },
    district: { type: String, required: false },
    city: { type: String, required: false },
    zipCode: { type: String, required: false },
})

export type UserType = Document & {
    _id: Types.ObjectId
    email: string
    password: string
    name: string
    phone: string
    dateOfBirth?: {
        day?: number
        month?: number
        year?: number
    }
    gender?: Gender
    address?: AddressType
    photoURL?: string
    isBlocked: boolean
    role: number
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
            required: [true, 'Email is required!'],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required!'],
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required!'],
            trim: true,
        },
        dateOfBirth: {
            day: {
                type: Number,
                required: false,
            },
            month: {
                type: Number,
                required: false,
            },
            year: {
                type: Number,
                require: false,
            },
        },
        gender: {
            type: String,
            enum: Object.values(Gender),
            trim: true,
        },
        address: addressSchema,
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
