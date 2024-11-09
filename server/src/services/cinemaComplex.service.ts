import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import {
  CinemaComplexType,
  cinemaComplexModel,
} from '~/schemas/cinemaComplex.schema'

const handleCreate = async (
  name: string,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<CinemaComplexType>
}> => {
  try {
    const checkExist = await cinemaComplexModel.findOne({ name })
    if (checkExist) {
      return {
        success: false,
        message: 'Cụm rạp đã tồn tại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const request = await cinemaComplexModel.create({ name })
    if (!request) {
      return {
        success: false,
        message: 'Tạo cụm rạp thất bại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Tạo cụm rạp thành công!',
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
  statusCode: number
  data?: Partial<CinemaComplexType>
}> => {
  try {
    const data = await cinemaComplexModel.findById(id)
    if (!data) {
      return {
        success: false,
        message: 'Cụm rạp không tồn tại!',
        statusCode: StatusCodes.NOT_FOUND,
      }
    }

    return {
      success: true,
      message: 'Lấy thông tin cụm rạp thành công!',
      statusCode: StatusCodes.OK,
      data,
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
  statusCode: number
  data?: Partial<CinemaComplexType>[]
}> => {
  try {
    const datas = await cinemaComplexModel.find()
    if (!datas || datas.length === 0) {
      return {
        success: false,
        message: 'Danh sách cụm rạp trống!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Lấy tất cả thông tin cụm rạp thành công!',
      statusCode: StatusCodes.OK,
      data: datas.map((data) => data.toObject()),
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
  name: string,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<CinemaComplexType>
}> => {
  try {
    const cinemaComplex = await cinemaComplexModel.findById(id)
    if (!cinemaComplex) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Cụm rạp không tồn tại',
      }
    }

    const checkExist = await cinemaComplexModel.findOne({
      name,
      _id: { $ne: id },
    })
    if (checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Cụm rạp đã tồn tại',
      }
    }

    const request = await cinemaComplexModel.findByIdAndUpdate(
      id,
      { $set: { name } },
      { new: true },
    )

    if (!request) {
      return {
        success: false,
        message: 'Cập nhật cụm rạp thất bại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Cập nhật cụm rạp thành công!',
      statusCode: StatusCodes.OK,
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

export const cinemaComplexService = {
  handleCreate,
  handleGetOne,
  handleGetAll,
  handleUpdate,
}
