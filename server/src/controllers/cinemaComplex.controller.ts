import { RequestHandler } from 'express'
import { Types } from 'mongoose'

import { handleJoiError } from '~/middlewares/joi.middleware'
import { catchErrors } from '~/utils/catchErrors'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { cinemaComplexService } from '~/services/cinemaComplex.service'
import { cinemaComplexValidation } from '~/validations/cinemaComplex.validation'

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
  const { name } = req.body

  const response = await cinemaComplexService.handleCreate(name)
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

  const response = await cinemaComplexService.handleGetOne(objectID)
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
  const response = await cinemaComplexService.handleGetAll()
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

  const response = await cinemaComplexService.handleUpdate(objectID, name)
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

export const cinemaComplexController = {
  handleCreate: [
    handleJoiError({ body: cinemaComplexValidation.handleCreate }),
    handleCreate,
  ],
  handleGetOne,
  handleGetAll,
  handleUpdate,
}
