import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { AddressType, Gender, userModel } from '~/schemas/user.schema'
import { UserType } from '~/schemas/user.schema'

type ProfileParams = {
    _id: Types.ObjectId
}

const profile = async (
    params: ProfileParams,
): Promise<{
    success: boolean
    message: string
    statusCode: number
    data?: Partial<UserType>
}> => {
    try {
        const user = await userModel.findById({ _id: params._id })

        if (!user) {
            return {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: 'Tài khoản không tồn tại!',
            }
        }

        const {
            password,
            isVerified,
            lastLogin,
            createdAt,
            updatedAt,
            isBlocked,
            __v,
            ...data
        } = user.toObject()

        return {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Lấy thông tin cá nhân thành công!',
            data,
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: `Lỗi hệ thống: ${error.message}`,
            }
        }
        return {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Đã xảy ra lỗi không xác định!',
        }
    }
}

type UpdateProfileParams = {
    _id: Types.ObjectId
    email?: string
    name?: string
    phone?: string
    dateOfBirth?: {
        day?: number
        month?: number
        year?: number
    }
    gender?: Gender
    address?: AddressType
    avatar?: string
}

const updateProfile = async (
    userId: Types.ObjectId,
    params: UpdateProfileParams,
): Promise<{
    success: boolean
    message: string
    statusCode: number

    data?: Partial<UserType>
}> => {
    try {
        const request = await userModel.findByIdAndUpdate(userId, params, {
            new: true,
            runValidators: true,
        })

        if (!request) {
            return {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message:
                    'Người dùng không tồn tại hoặc có lỗi trong quá trình cập nhật!',
            }
        }

        const {
            password,
            isVerified,
            lastLogin,
            createdAt,
            updatedAt,
            isBlocked,
            __v,
            ...data
        } = request.toObject()

        return {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Cập nhật tài khoản thành công!',
            data,
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: `Lỗi hệ thống: ${error.message}`,
            }
        }
        return {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Đã xảy ra lỗi không xác định!',
        }
    }
}

const userService = {
    profile,
    updateProfile,
}

export default userService
