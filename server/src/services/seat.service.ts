import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { SeatType, seatModel } from '~/schemas/seat.schema'

const handleCreate = async (
  number: number,
  row: string,
  type: string,
  price: number,
  room: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<SeatType>
}> => {
  try {
    const checkExist = await seatModel.findOne({ number, row, room })
    if (checkExist) {
      return {
        success: false,
        message: 'Ghế đã tồn tại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const request = await seatModel.create({
      number,
      row,
      type,
      room,
      price,
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
      message: 'Tạo ghế mới thành công!',
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
  data?: Partial<SeatType>
  statusCode: number
}> => {
  try {
    const request = await seatModel
      .findById(id)
      .populate('room')
      .populate({
        path: 'room',
        populate: {
          path: 'cinema',
          select: 'name',
        },
      })
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không tìm thấy ghế!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy ghế thành công!',
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
  data?: Partial<SeatType>[]
  statusCode: number
}> => {
  try {
    const request = await seatModel
      .find()
      .populate('room')
      .populate({
        path: 'room',
        populate: {
          path: 'cinema',
          select: 'name',
        },
      })
    if (!request || request.length === 0) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có ghế nào!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy tất cả ghế thành công!',
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
  number: number,
  row: string,
  type: string,
  price: number,
  room: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  data?: Partial<SeatType>
  statusCode: number
}> => {
  try {
    const seat = await seatModel.findById(id)
    if (!seat) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Ghế không tồn tại',
      }
    }

    const checkExist = await seatModel.findOne({
      number,
      row,
      _id: { $ne: id },
    })
    if (checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Ghế đã tồn tại',
      }
    }

    const request = await seatModel.findByIdAndUpdate(
      id,
      {
        $set: {
          number,
          row,
          type,
          price,
          room,
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
        message: 'Cập nhật thông tin ghế thất bại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cập nhật thông tin ghế thành công!',
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

const handleDelete = async (id: Types.ObjectId) => {
  try {
    const request = await seatModel.findByIdAndDelete(id)
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Xóa thông tin ghế thất bại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xóa thông tin ghế thành công!',
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

export const seatService = {
  handleCreate,
  handleGetOne,
  handleGetAll,
  handleUpdate,
  handleDelete,
}
