import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { ProductType, productModel } from '~/schemas/product.schema'

const handleCreate = async (
  name: string,
  category: Types.ObjectId,
  price: number,
  size: string,
  image: string,
  description?: string,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<ProductType>
}> => {
  try {
    const checkExist = await productModel.findOne({ name })
    if (checkExist) {
      return {
        success: false,
        message: 'Sản phẩm đã tồn tại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const request = await productModel.create({
      name,
      category,
      price,
      size,
      image,
      description,
    })
    if (!request) {
      return {
        success: false,
        message: 'Tạo sản phẩm thất bại!',
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
  data?: Partial<ProductType>
}> => {
  try {
    const request = await productModel.findById(id).populate('category')
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
  data?: Partial<ProductType>[]
}> => {
  try {
    const datas = await productModel.find().populate('category')
    if (!datas || datas.length === 0) {
      return {
        success: false,
        message: 'Danh mục sản phẩm trống!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Lấy tất cả thông tin sản phẩm thành công!',
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
  category: Types.ObjectId,
  price: number,
  size: string,
  image: string,
  description?: string,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<ProductType>
}> => {
  try {
    const product = await productModel.findById(id)
    if (!product) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Sản phẩm không tồn tại',
      }
    }

    const checkExist = await productModel.findOne({
      name,
      _id: { $ne: id },
    })
    if (checkExist) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Sản phẩm đã tồn tại',
      }
    }

    const request = await productModel.findByIdAndUpdate(
      id,
      { $set: { name, category, price, size, image, description } },
      { new: true },
    )
    if (!request) {
      return {
        success: false,
        message: 'Cập nhật sản phẩm thất bại!',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    return {
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
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

export const productService = {
  handleCreate,
  handleGetOne,
  handleGetAll,
  handleUpdate,
}
