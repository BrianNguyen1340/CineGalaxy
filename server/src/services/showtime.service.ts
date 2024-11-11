import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { ShowtimeType, showtimeModel } from '~/schemas/showtime.schema'

const handleCreate = async (
  date: Date,
  timeStart: Date,
  timeEnd: Date,
  movie: Types.ObjectId,
  room: Types.ObjectId,
  cinema: Types.ObjectId,
  cinemaComplex: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<ShowtimeType>
}> => {
  try {
    const checkExist = await showtimeModel.findOne({
      date,
      movie,
      cinema,
      cinemaComplex,
      room,
      $or: [
        {
          $and: [
            { timeStart: { $lt: timeEnd } },
            { timeEnd: { $gt: timeStart } },
          ],
        },
      ],
    })
    if (checkExist) {
      return {
        success: false,
        message:
          'Hiện tại phòng này đã có suất chiếu! Vui lòng chọn thời gian khác!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const request = await showtimeModel.create({
      date,
      timeStart,
      timeEnd,
      movie,
      room,
      cinema,
      cinemaComplex,
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
      message: 'Tạo suất chiếu mới thành công!',
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
  data?: Partial<ShowtimeType>
  statusCode: number
}> => {
  try {
    const request = await showtimeModel
      .findById(id)
      .populate('movie')
      .populate('cinema')
      .populate('cinemaComplex')
      .populate({
        path: 'room',
        populate: {
          path: 'cinema',
        },
      })
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không tìm thấy suất chiếu!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy suất chiếu thành công!',
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
  data?: Partial<ShowtimeType>[]
  statusCode: number
}> => {
  try {
    const request = await showtimeModel
      .find()
      .populate('movie')
      .populate('cinema')
      .populate('cinemaComplex')
      .populate({
        path: 'room',
        populate: {
          path: 'cinema',
        },
      })
    if (!request || request.length === 0) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có suất chiếu nào!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy tất cả suất chiếu thành công!',
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
  date: Date,
  timeStart: Date,
  timeEnd: Date,
  movie: Types.ObjectId,
  room: Types.ObjectId,
  cinema: Types.ObjectId,
  cinemaComplex: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<ShowtimeType>
}> => {
  try {
    const showtime = await showtimeModel.findById(id)
    
    if (!showtime) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Suất chiếu không tồn tại',
      }
    }

    const conflictingShowtime = await showtimeModel.findOne({
      _id: { $ne: id },
      date,
      room,
      cinema,
      cinemaComplex,
      $or: [
        {
          $and: [
            { timeStart: { $lt: timeEnd } },
            { timeEnd: { $gt: timeStart } },
          ],
        },
        {
          $and: [
            { timeStart: { $gte: timeStart } },
            { timeEnd: { $lte: timeEnd } },
          ],
        },
      ],
    })

    if (conflictingShowtime) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message:
          'Hiện tại phòng này đã có suất chiếu! Vui lòng chọn thời gian khác!',
      }
    }

    const request = await showtimeModel.findByIdAndUpdate(
      id,
      {
        $set: {
          date,
          timeStart,
          timeEnd,
          movie,
          room,
          cinema,
          cinemaComplex,
        },
      },
      { new: true },
    )

    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Cập nhật suất chiếu thất bại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cập nhật thông tin suất chiếu thành công!',
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

export const showtimeService = {
  handleCreate,
  handleGetOne,
  handleGetAll,
  handleUpdate,
}
