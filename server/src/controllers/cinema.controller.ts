import { RequestHandler } from 'express'
import { Types } from 'mongoose'

import { handleJoiError } from '~/middlewares/joi.middleware'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { cinemaService } from '~/services/cinema.service'
import { catchErrors } from '~/utils/catchErrors'
import { cinemaValidation } from '~/validations/cinema.validation'

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
  const { name, email, address, phone, cinemaComplex } = req.body

  const response = await cinemaService.handleCreate(
    name,
    email,
    address,
    phone,
    cinemaComplex,
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

  const response = await cinemaService.handleGetOne(objectID)
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
  const response = await cinemaService.handleGetAll()
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
  const { name, email, address, phone, cinemaComplex } = req.body

  const objectID = new Types.ObjectId(id)

  const response = await cinemaService.handleUpdate(
    objectID,
    name,
    email,
    address,
    phone,
    cinemaComplex,
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

export const cinemaController = {
  handleCreate: [
    handleJoiError({ body: cinemaValidation.handleCreate }),
    handleCreate,
  ],
  handleGetOne,
  handleGetAll,
  handleUpdate: [
    handleJoiError({ body: cinemaValidation.handleUpdate }),
    handleUpdate,
  ],
}
