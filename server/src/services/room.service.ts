import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { MovieType, movieModel } from '~/schemas/movie.schema'

// *****************************************************************************

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
  data?: Partial<MovieType>
}> => {
  try {
    const checkExist = await movieModel.findOne({ name })
    if (checkExist) {
      return {
        success: false,
        message: 'Phòng đã tồn tại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const request = await movieModel.create({
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

export const roomService = {
  handleCreate,
}
