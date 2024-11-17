import { RequestHandler } from 'express'
import { Types } from 'mongoose'

import { handleJoiError } from '~/middlewares/joi.middleware'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { catchErrors } from '~/utils/catchErrors'
import { comboService } from '~/services/combo.service'
import { comboValidation } from '~/validations/combo.validation'

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
  const { name, expiry, products, image } = req.body

  const response = await comboService.handleCreate(
    name,
    expiry,
    products,
    image,
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

const handleGetOne = catchErrors(async (req, res) => {
  const { id } = req.params
  const objectID = new Types.ObjectId(id)

  const response = await comboService.handleGetOne(objectID)
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
  const response = await comboService.handleGetAll()
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
  const { id } = req.params
  const objectID = new Types.ObjectId(id)

  const { name, expiry, products, image } = req.body

  const response = await comboService.handleUpdate(
    objectID,
    name,
    expiry,
    products,
    image,
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

export const comboController = {
  handleCreate: [
    handleJoiError({ body: comboValidation.handleCreate }),
    handleCreate,
  ],
  handleGetOne,
  handleGetAll,
  handleUpdate: [
    handleJoiError({ body: comboValidation.handleUpdate }),
    handleUpdate,
  ],
}
