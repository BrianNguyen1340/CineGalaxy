import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import {
  ProductCategoryType,
  productCategoryModel,
} from '~/schemas/productCategory.schema'

const handleCreate = async (
  name: string,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<ProductCategoryType>
}> => {
  try {
    const checkExist = await productCategoryModel.findOne({ name })

    if (checkExist) {
      return {
        success: false,
        message: 'Danh mục sản phẩm đã tồn tại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const request = await productCategoryModel.create({ name })

    if (!request) {
      return {
        success: false,
        message: 'Tạo danh mục sản phẩm thất bại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Tạo danh mục sản phẩm thành công!',
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
  data?: Partial<ProductCategoryType>
}> => {
  try {
    const request = await productCategoryModel.findById(id)

    if (!request) {
      return {
        success: false,
        message: 'Danh mục sản phẩm không tồn tại!',
        statusCode: StatusCodes.NOT_FOUND,
      }
    }

    return {
      success: true,
      message: 'Lấy thông tin danh mục sản phẩm thành công!',
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

const handleGetAll = async (): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<ProductCategoryType>[]
}> => {
  try {
    const datas = await productCategoryModel.find()

    if (!datas || datas.length === 0) {
      return {
        success: false,
        message: 'Danh mục sản phẩm trống!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Lấy tất cả thông tin danh mục sản phẩm thành công!',
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
  data?: Partial<ProductCategoryType>
}> => {
  try {
    const cinemaComplex = await productCategoryModel.findById(id)

    if (!cinemaComplex) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Danh mục sản phẩm không tồn tại',
      }
    }

    const checkExist = await productCategoryModel.findOne({
      name,
      _id: { $ne: id },
    })

    if (checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Danh mục sản phẩm đã tồn tại',
      }
    }

    const request = await productCategoryModel.findByIdAndUpdate(
      id,
      { $set: { name } },
      { new: true },
    )

    if (!request) {
      return {
        success: false,
        message: 'Cập nhật danh mục sản phẩm thất bại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Cập nhật danh mục sản phẩm thành công!',
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

export const productCategoryService = {
  handleCreate,
  handleGetOne,
  handleGetAll,
  handleUpdate,
}
