import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { ComboType, comboModel } from '~/schemas/combo.schema'

const handleCreate = async (
  name: string,
  expiry: number,
  products: Types.ObjectId[],
  image: string,
): Promise<{
  success: boolean
  message: string
  data?: Partial<ComboType>
  statusCode: number
}> => {
  try {
    const checkExist = await comboModel.findOne({
      name,
    })
    if (checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.CONFLICT,
        message: 'Combo đã tồn tại!',
      }
    }

    const request = await comboModel.create({
      name,
      expiry,
      products,
      image,
    })
    if (!request) {
      return {
        success: false,
        message: 'Có lỗi khi tạo combo!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Tạo combo thành công!',
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
  data?: Partial<ComboType>
  statusCode: number
}> => {
  try {
    const request = await comboModel.findById(id).populate('products')
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không tìm thấy combo!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy combo thành công!',
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
  data?: Partial<ComboType>[]
  statusCode: number
}> => {
  try {
    const request = await comboModel.find().populate('products')
    if (!request || request.length === 0) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có combo nào!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy tất cả thông tin combo thành công!',
      data: request.map((combo) => combo.toObject()),
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
  expiry: number,
  products: Types.ObjectId[],
  image: string,
): Promise<{
  success: boolean
  message: string
  data?: Partial<ComboType>
  statusCode: number
}> => {
  try {
    const combo = await comboModel.findById(id)
    if (!combo) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Combo không tồn tại',
      }
    }

    const checkExist = await comboModel.findOne({
      name,
    })
    if (checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Combo đã tồn tại',
      }
    }

    const request = await comboModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          expiry,
          products,
          image,
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
        message: 'Cập nhật combo thất bại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cập nhật combo thành công!',
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

export const comboService = {
  handleCreate,
  handleGetOne,
  handleGetAll,
  handleUpdate,
}
