import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { AddressType, userModel, UserType } from '~/schemas/user.schema'

// *****************************************************************************

const profile = async (
  id: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<UserType>
}> => {
  try {
    const user = await userModel.findById(id)
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Tài khoản không tồn tại!',
      }
    }

    const { password, isVerified, createdAt, updatedAt, __v, ...data } =
      user.toObject()

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
  id: Types.ObjectId
  email?: string
  name?: string
  phone?: string
  dateOfBirth?: {
    day?: number
    month?: number
    year?: number
  }
  gender?: string
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
    const request = await userModel.findByIdAndUpdate(
      userId,
      { $set: params },
      {
        new: true,
        runValidators: true,
      },
    )
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message:
          'Người dùng không tồn tại hoặc có lỗi trong quá trình cập nhật!',
      }
    }

    const { password, isVerified, createdAt, updatedAt, __v, ...data } =
      request.toObject()

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

const getUserByAdmin = async (
  _id: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<UserType>
}> => {
  try {
    const user = await userModel.findById(_id).select('-password')
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy thông tin người dùng thành công!',
      data: user,
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

const getAllUsersByAdmin = async (): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<UserType>[]
}> => {
  try {
    const users = await userModel.find().select('-password')
    if (!users || users.length === 0) {
      return {
        success: false,
        message: 'Danh sách người dùng trống!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Lấy tất cả thông tin người dùng thành công!',
      statusCode: StatusCodes.OK,
      data: users.map((user) => user.toObject()),
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

const updateUserByAdmin = async (
  id: Types.ObjectId,
  userData?: {
    email?: string
    password?: string
    name?: string
    phone?: string
    dateOfBirth?: {
      day?: number
      month?: number
      year?: number
    }
    gender?: string
    address?: AddressType
    photoURL?: string
    role?: number
  },
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<UserType>
}> => {
  try {
    const user = await userModel.findById(id)
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      }
    }

    const request = await userModel.findByIdAndUpdate(
      id,
      { $set: userData },
      {
        new: true,
      },
    )
    if (!request) {
      return {
        success: false,
        message: 'Cập nhật thông tin người dùng thất bại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Cập nhật thông tin người dùng thành công!',
      statusCode: StatusCodes.OK,
      data: request,
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

const blockAccount = async (
  id: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<UserType>
}> => {
  try {
    const user = await userModel.findById(id).select('-password')
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Tài khoản không tồn tại!',
      }
    }

    const response = await userModel.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true },
    )
    if (!response) {
      return {
        success: false,
        message: 'Khóa tài khoản thất bại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const { password, isVerified, createdAt, updatedAt, __v, ...data } =
      user.toObject()

    return {
      success: true,
      message: 'Khóa tài khoản thành công!',
      statusCode: StatusCodes.OK,
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

const unblockAccount = async (
  id: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<UserType>
}> => {
  try {
    const user = await userModel.findById(id)
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Tài khoản không tồn tại!',
      }
    }

    const response = await userModel.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true },
    )
    if (!response) {
      return {
        success: false,
        message: 'Khóa tài khoản thất bại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const { password, isVerified, createdAt, updatedAt, __v, ...data } =
      user.toObject()

    return {
      success: true,
      message: 'Mở khóa tài khoản thành công!',
      statusCode: StatusCodes.OK,
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
  getUserByAdmin,
  getAllUsersByAdmin,
  updateUserByAdmin,
  blockAccount,
  unblockAccount,
}

export default userService
