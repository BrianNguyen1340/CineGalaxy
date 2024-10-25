import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { CinemaType, cinemaModel } from '~/schemas/cinema.schema'

// *****************************************************************************

const handleCreate = async (
  name: string,
  email: string,
  address: string,
  phone: string,
): Promise<{
  success: boolean
  message: string
  data?: Partial<CinemaType>
  statusCode: number
}> => {
  try {
    const checkExist = await cinemaModel.findOne({
      name,
    })
    if (checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.CONFLICT,
        message: 'Rạp phim đã tồn tại!',
      }
    }

    const request = await cinemaModel.create({
      name,
      address,
      phone,
      email,
    })
    if (!request) {
      return {
        success: false,
        message: 'Có lỗi khi tạo rạp!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Tạo rạp thành công!',
      statusCode: StatusCodes.CREATED,
      data: request,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

const handleGetOne = async (
  id: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  data?: Partial<CinemaType>
  statusCode: number
}> => {
  try {
    const request = await cinemaModel.findById(id)
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không tìm thấy rạp!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy rạp thành công!',
      data: request,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

const handleGetAll = async (): Promise<{
  success: boolean
  message: string
  data?: Partial<CinemaType>[]
  statusCode: number
}> => {
  try {
    const request = await cinemaModel.find()
    if (!request || request.length === 0) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có rạp nào!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy tất cả rạp thành công!',
      data: request.map((category) => category.toObject()),
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

const handleUpdate = async (
  id: Types.ObjectId,
  name?: string,
  email?: string,
  address?: string,
  phone?: string,
): Promise<{
  success: boolean
  message: string
  data?: Partial<CinemaType>
  statusCode: number
}> => {
  try {
    const checkExist = await cinemaModel.findOne(id)
    if (!checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Rạp không tồn tại',
      }
    }

    const request = await cinemaModel.findByIdAndUpdate(
      id,
      {
        name,
        address,
        phone,
        email,
      },
      {
        new: true,
      },
    )
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Cập nhật rạp thất bại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cập nhật rạp thành công!',
      data: request,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

export const cinemaService = {
  handleCreate,
  handleGetOne,
  handleGetAll,
  handleUpdate,
}
