import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { CategoryType, categoryModel } from '~/schemas/category.schema'

type createData = {
    name: string
}

const handleCreate = async (
    reqBody: createData,
): Promise<{
    success: boolean
    message: string
    data?: Partial<CategoryType>
    statusCode: number
}> => {
    try {
        const checkExist = await categoryModel.findOne({
            name: reqBody.name,
        })
        if (checkExist) {
            return {
                success: false,
                statusCode: StatusCodes.CONFLICT,
                message: 'Danh mục phim đã tồn tại!',
            }
        }

        const request = await categoryModel.create({
            name: reqBody.name,
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

type GetOneData = {
    _id: string
}

const handleGetOne = async (
    reqParam: GetOneData,
): Promise<{
    success: boolean
    message: string
    data?: Partial<CategoryType>
    statusCode: number
}> => {
    try {
        const request = await categoryModel.findById(reqParam._id)
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
    data?: Partial<CategoryType>[]
    statusCode: number
}> => {
    try {
        const request = await categoryModel.find()
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

type updateData = {
    _id: string
    name: string
}

const handleUpdate = async (
    reqBody: updateData,
): Promise<{
    success: boolean
    message: string
    data?: Partial<CategoryType>
    statusCode: number
}> => {
    try {
        const checkExist = await categoryModel.findOne({ _id: reqBody._id })
        if (!checkExist) {
            return {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Danh mục không tồn tại',
            }
        }

        const request = await categoryModel.findByIdAndUpdate(
            reqBody._id,
            reqBody,
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

export const categoryService = {
    handleCreate,
    handleGetOne,
    handleGetAll,
    handleUpdate,
}
