import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { RoomType, roomModel } from '~/schemas/room.schema'

const handleCreate = async (
  name: string,
  opacity: number,
  status: string,
  screen: string,
  cinema: string,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<RoomType>
}> => {
  try {
    const checkExist = await roomModel.findOne({ name, cinema })

    if (checkExist) {
      return {
        success: false,
        message: 'Phòng đã tồn tại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const request = await roomModel.create({
      name,
      opacity,
      status,
      screen,
      cinema,
    })
    if (!request) {
      return {
        success: false,
        message: 'Có lỗi',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Tạo phòng mới thành công!',
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
  data?: Partial<RoomType>
  statusCode: number
}> => {
  try {
    const request = await roomModel.findById(id).populate('cinema')

    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không tìm thấy phòng!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy phòng thành công!',
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
  data?: Partial<RoomType>[]
  statusCode: number
}> => {
  try {
    const request = await roomModel.find().populate('cinema')

    if (!request || request.length === 0) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có phòng nào!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy tất cả phòng thành công!',
      data: request.map((item) => item.toObject()),
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
  opacity: number,
  status: string,
  screen: string,
  cinema: string,
): Promise<{
  success: boolean
  message: string
  data?: Partial<RoomType>
  statusCode: number
}> => {
  try {
    const room = await roomModel.findById(id)

    if (!room) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Thông tin phòng không tồn tại',
      }
    }

    const checkExist = await roomModel.findOne({
      name,
      cinema,
      _id: { $ne: id },
    })

    if (checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Thông tin phòng đã tồn tại',
      }
    }

    const request = await roomModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          opacity,
          status,
          screen,
          cinema,
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
        message: 'Cập nhật thông tin phòng thất bại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cập nhật thông tin phòng thành công!',
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

export const roomService = {
  handleCreate,
  handleGetOne,
  handleGetAll,
  handleUpdate,
}
