import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { MovieType, movieModel } from '~/schemas/movie.schema'

const handleCreate = async (
  name: string,
  slug: string,
  description: string,
  director: string,
  releaseDate: Date,
  duration: number,
  poster: string,
  banner: string,
  trailer: string,
  movieRating: string,
  subtitle: string,
  movieFormat: string,
  genres: Types.ObjectId[],
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<MovieType>
}> => {
  try {
    const checkExist = await movieModel.findOne({
      name,
    })
    if (checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.CONFLICT,
        message: 'Phim đã tồn tại!',
      }
    }

    const newMovie = await movieModel.create({
      name,
      slug,
      description,
      director,
      releaseDate,
      duration,
      poster,
      banner,
      trailer,
      movieRating,
      subtitle,
      movieFormat,
      genres,
    })
    if (!newMovie) {
      return {
        success: false,
        message: 'Có lỗi khi tạo phim!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Tạo phim thành công!',
      statusCode: StatusCodes.CREATED,
      data: newMovie,
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
  data?: Partial<MovieType>
  statusCode: number
}> => {
  try {
    const request = await movieModel.findById(id).populate('genres')
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không tìm thấy phim!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy thông tin phim thành công!',
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
  data?: Partial<MovieType>[]
  statusCode: number
}> => {
  try {
    const request = await movieModel.find().populate('genres')
    if (!request || request.length === 0) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có phim nào!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy tất cả phim thành công!',
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
  description: string,
  director: string,
  releaseDate: Date,
  duration: number,
  poster: string,
  banner: string,
  trailer: string,
  movieRating: string,
  subtitle: string,
  movieFormat: string,
  genres: Types.ObjectId[],
): Promise<{
  success: boolean
  message: string
  data?: Partial<MovieType>
  statusCode: number
}> => {
  try {
    const checkExist = await movieModel.findOne(id)
    if (!checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Phim không tồn tại',
      }
    }

    const request = await movieModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          description,
          director,
          releaseDate,
          duration,
          poster,
          banner,
          trailer,
          movieRating,
          subtitle,
          movieFormat,
          genres,
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
        message: 'Cập nhật phim thất bại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cập nhật phim thành công!',
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

const handleHideMovie = async (
  id: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  data?: Partial<MovieType>
  statusCode: number
}> => {
  try {
    const checkExist = await movieModel.findOne(id)
    if (!checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Phim không tồn tại',
      }
    }

    const request = await movieModel.findByIdAndUpdate(
      id,
      {
        hidden: true,
      },
      {
        new: true,
      },
    )
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Ẩn phim thất bại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Ẩn phim thành công!',
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

const handleShowtimeMovie = async (
  id: Types.ObjectId,
): Promise<{
  success: boolean
  message: string
  data?: Partial<MovieType>
  statusCode: number
}> => {
  try {
    const checkExist = await movieModel.findOne(id)
    if (!checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Phim không tồn tại',
      }
    }

    const request = await movieModel.findByIdAndUpdate(
      id,
      {
        hidden: false,
      },
      {
        new: true,
      },
    )
    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Hiện phim thất bại!',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Hiện phim thành công!',
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

export const movieService = {
  handleCreate,
  handleGetOne,
  handleGetAll,
  handleUpdate,
  handleHideMovie,
  handleShowtimeMovie,
}
