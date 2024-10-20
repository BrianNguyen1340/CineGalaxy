import { RequestHandler } from 'express'

import { handleJoiError } from '~/middlewares/joi.middleware'
import { categoryValidation } from '~/validations/category.validation'
import {
    sendErrorResponse,
    sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { categoryService } from '~/services/category.service'
import { catchErrors } from '~/utils/catchErrors'

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
    const { name } = req.body

    const response = await categoryService.handleCreate({ name })
    if (!response.success) {
        return sendErrorResponse(res, response.statusCode, response.message)
    }

    return sendSuccessResponse(
        res,
        response.statusCode,
        response.message,
        response.data,
    )
})

const handleGetOne = catchErrors(async (req, res) => {
    const { _id } = req.params

    const response = await categoryService.handleGetOne({ _id })
    if (!response.success) {
        return sendErrorResponse(res, response.statusCode, response.message)
    }

    return sendSuccessResponse(
        res,
        response.statusCode,
        response.message,
        response.data,
    )
})

const handleGetAll = catchErrors(async (req, res) => {
    const response = await categoryService.handleGetAll()
    if (!response.success) {
        return sendErrorResponse(res, response.statusCode, response.message)
    }

    return sendSuccessResponse(
        res,
        response.statusCode,
        response.message,
        response.data,
    )
})

const handleUpdate = catchErrors(async (req, res) => {
    const { _id } = req.params
    const { name } = req.body

    const response = await categoryService.handleUpdate({ _id, name })
    if (!response.success) {
        return sendErrorResponse(res, response.statusCode, response.message)
    }

    return sendSuccessResponse(
        res,
        response.statusCode,
        response.message,
        response.data,
    )
})

export const categoryController = {
    handleCreate: [
        handleJoiError({ body: categoryValidation.handleCreate }),
        handleCreate,
    ],
    handleGetOne,
    handleGetAll,
    handleUpdate: [
        handleJoiError({ body: categoryValidation.handleUpdate }),
        handleUpdate,
    ],
}
