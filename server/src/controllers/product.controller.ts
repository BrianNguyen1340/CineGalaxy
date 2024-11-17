import { RequestHandler } from 'express'
import { Types } from 'mongoose'

import { handleJoiError } from '~/middlewares/joi.middleware'
import { catchErrors } from '~/utils/catchErrors'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { productService } from '~/services/product.service'
import { productValidation } from '~/validations/product.validation'

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
  const { name, category, price, size, image, description } = req.body

  const response = await productService.handleCreate(
    name,
    category,
    price,
    size,
    image,
    description,
  )
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

  const response = await productService.handleGetOne(objectID)
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
  const response = await productService.handleGetAll()
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
  const objectID = new Types.ObjectId(id)

  const { name, category, price, size, image, description } = req.body

  const response = await productService.handleUpdate(
    objectID,
    name,
    category,
    price,
    size,
    image,
    description,
  )
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

export const productController = {
  handleCreate: [
    handleJoiError({ body: productValidation.handleCreate }),
    handleCreate,
  ],
  handleGetOne,
  handleGetAll,
  handleUpdate: [
    handleJoiError({ body: productValidation.handleUpdate }),
    handleUpdate,
  ],
}
