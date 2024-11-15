import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { GenreType, genreModel } from '~/schemas/genre.schema'

const handleCreate = async (
  name: string,
): Promise<{
  success: boolean
  message: string
  data?: Partial<GenreType>
  statusCode: number
}> => {
  try {
    const checkExist = await genreModel.findOne({
      name,
    })

    if (checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.CONFLICT,
        message: 'Danh mục phim đã tồn tại!',
      }
    }

    const request = await genreModel.create({
      name,
    })

    if (!request) {
      return {
        success: false,
        message: 'Có lỗi khi tạo danh mục!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Tạo danh mục phim thành công!',
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
  data?: Partial<GenreType>
  statusCode: number
}> => {
  try {
    const request = await genreModel.findById(id)

    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không tìm thấy danh mục!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy danh mục thành công!',
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
  data?: Partial<GenreType>[]
  statusCode: number
}> => {
  try {
    const request = await genreModel.find()

    if (!request || request.length === 0) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có danh mục nào!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy tất cả danh mục thành công!',
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
  name: string,
): Promise<{
  success: boolean
  message: string
  data?: Partial<GenreType>
  statusCode: number
}> => {
  try {
    const checkExist = await genreModel.findOne(id)

    if (!checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Danh mục không tồn tại',
      }
    }

    const request = await genreModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
        },
      },
      {
        new: true,
      },
    )
    
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Cập nhật danh mục thất bại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cập nhật thành công!',
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

export const genreService = {
  handleCreate,
  handleGetOne,
  handleGetAll,
  handleUpdate,
}
