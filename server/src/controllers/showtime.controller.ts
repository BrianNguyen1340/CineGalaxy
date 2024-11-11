import { RequestHandler } from 'express'
import { Types } from 'mongoose'

import { handleJoiError } from '~/middlewares/joi.middleware'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { catchErrors } from '~/utils/catchErrors'
import { showtimeService } from '~/services/showtime.service'
import { showtimeValidation } from '~/validations/showtime.validation'

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
  const { date, timeStart, timeEnd, movie, room, cinema, cinemaComplex } =
    req.body

  const response = await showtimeService.handleCreate(
    date,
    timeStart,
    timeEnd,
    movie,
    room,
    cinema,
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

const handleGetOne: RequestHandler = catchErrors(async (req, res) => {
  const { id } = req.params

  const objectID = new Types.ObjectId(id)

  const response = await showtimeService.handleGetOne(objectID)
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
  const response = await showtimeService.handleGetAll()

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
  const { date, timeStart, timeEnd, movie, room, cinema, cinemaComplex } =
    req.body

  const objectID = new Types.ObjectId(id)

  const response = await showtimeService.handleUpdate(
    objectID,
    date,
    timeStart,
    timeEnd,
    movie,
    room,
    cinema,
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

export const showtimeController = {
  handleCreate: [
    handleJoiError({ body: showtimeValidation.handleCreate }),
    handleCreate,
  ],
  handleGetOne,
  handleGetAll,
  handleUpdate: [
    handleJoiError({ body: showtimeValidation.handleUpdate }),
    handleUpdate,
  ],
}
