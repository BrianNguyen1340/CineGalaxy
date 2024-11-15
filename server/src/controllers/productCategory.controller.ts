import { RequestHandler } from 'express'
import { Types } from 'mongoose'

import { handleJoiError } from '~/middlewares/joi.middleware'
import { catchErrors } from '~/utils/catchErrors'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { productCategoryService } from '~/services/productCategory.service'
import { productCategoryValidation } from '~/validations/productCategory.validation'

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
  const { name } = req.body

  const response = await productCategoryService.handleCreate(name)

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

const handleGetOne: RequestHandler = catchErrors(async (req, res) => {
  const { id } = req.params

  const objectID = new Types.ObjectId(id)

  const response = await productCategoryService.handleGetOne(objectID)

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

const handleGetAll: RequestHandler = catchErrors(async (req, res) => {
  const response = await productCategoryService.handleGetAll()

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

const handleUpdate: RequestHandler = catchErrors(async (req, res) => {
  const { id } = req.params
  
  const { name } = req.body

  const objectID = new Types.ObjectId(id)

  const response = await productCategoryService.handleUpdate(objectID, name)

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

export const productCategoryController = {
  handleCreate: [
    handleJoiError({ body: productCategoryValidation.handleCreate }),
    handleCreate,
  ],
  handleGetOne,
  handleGetAll,
  handleUpdate: [
    handleJoiError({ body: productCategoryValidation.handleUpdate }),
    handleUpdate,
  ],
}
