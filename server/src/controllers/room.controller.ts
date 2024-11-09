import { Types } from 'mongoose'

import { catchErrors } from '~/utils/catchErrors'
import { roomValidation } from '~/validations/room.validation'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { handleJoiError } from '~/middlewares/joi.middleware'
import { roomService } from '~/services/room.service'

const handleCreate = catchErrors(async (req, res) => {
  const { name, opacity, status, screen, cinema } = req.body

  const response = await roomService.handleCreate(
    name,
    opacity,
    status,
    screen,
    cinema,
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

  const response = await roomService.handleGetOne(objectID)
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
  const response = await roomService.handleGetAll()
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
  const { name, opacity, status, screen, cinema } = req.body

  const objectID = new Types.ObjectId(id)

  const response = await roomService.handleUpdate(
    objectID,
    name,
    opacity,
    status,
    screen,
    cinema,
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

export const roomController = {
  handleCreate: [
    handleJoiError({ body: roomValidation.handleCreate }),
    handleCreate,
  ],
  handleGetOne,
  handleGetAll,
  handleUpdate: [
    handleJoiError({ body: roomValidation.handleUpdate }),
    handleUpdate,
  ],
}
