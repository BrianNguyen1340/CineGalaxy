import { RequestHandler } from 'express'
import { Types } from 'mongoose'

import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { seatService } from '~/services/seat.service'
import { catchErrors } from '~/utils/catchErrors'
import { handleJoiError } from '~/middlewares/joi.middleware'
import { seatValidation } from '~/validations/seat.validation'

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
  const { number, row, type, price, room } = req.body

  const response = await seatService.handleCreate(number, row, type, price, room)
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

  const response = await seatService.handleGetOne(objectID)
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
  const response = await seatService.handleGetAll()
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
  const { number, row, type, price, room } = req.body

  const objectID = new Types.ObjectId(id)

  const response = await seatService.handleUpdate(
    objectID,
    number,
    row,
    type,
    price,
    room,
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

export const seatController = {
  handleCreate: [
    handleJoiError({ body: seatValidation.handleCreate }),
    handleCreate,
  ],
  handleGetOne,
  handleGetAll,
  handleUpdate: [
    handleJoiError({ body: seatValidation.handleUpdate }),
    handleUpdate,
  ],
}
