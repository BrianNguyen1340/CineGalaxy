import { RequestHandler } from 'express'
import { Types } from 'mongoose'

import { handleJoiError } from '~/middlewares/joi.middleware'
import { genreValidation } from '~/validations/genre.validation'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { genreService } from '~/services/genre.service'
import { catchErrors } from '~/utils/catchErrors'

// *****************************************************************************

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
  const { name } = req.body

  const response = await genreService.handleCreate(name)
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

  const response = await genreService.handleGetOne(objectID)
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
  const response = await genreService.handleGetAll()
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
  const { name } = req.body

  const objectID = new Types.ObjectId(id)

  const response = await genreService.handleUpdate(objectID, name)
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

export const genreController = {
  handleCreate: [
    handleJoiError({ body: genreValidation.handleCreate }),
    handleCreate,
  ],
  handleGetOne,
  handleGetAll,
  handleUpdate: [
    handleJoiError({ body: genreValidation.handleUpdate }),
    handleUpdate,
  ],
}
