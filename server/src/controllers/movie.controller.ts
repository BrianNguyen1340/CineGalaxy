import { RequestHandler } from 'express'

import { handleJoiError } from '~/middlewares/joi.middleware'
import { movieValidation } from '~/validations/movie.validation'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { movieService } from '~/services/movie.service'
import { catchErrors } from '~/utils/catchErrors'
import { Types } from 'mongoose'

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
  const {
    name,
    description,
    director,
    releaseDate,
    age,
    duration,
    poster,
    trailer,
    movieRating,
    genreId,
  } = req.body

  const response = await movieService.handleCreate(
    name,
    description,
    director,
    releaseDate,
    age,
    duration,
    poster,
    trailer,
    movieRating,
    genreId,
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

  const response = await movieService.handleGetOne(objectID)
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
  const response = await movieService.handleGetAll()
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
  const {
    name,
    description,
    director,
    releaseDate,
    age,
    duration,
    poster,
    trailer,
    movieRating,
    genreId,
  } = req.body

  const objectID = new Types.ObjectId(id)

  const response = await movieService.handleUpdate(
    objectID,
    name,
    description,
    director,
    releaseDate,
    age,
    duration,
    poster,
    trailer,
    movieRating,
    genreId,
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

export const movieController = {
  handleCreate: [
    handleJoiError({ body: movieValidation.handleCreate }),
    handleCreate,
  ],
  handleGetOne,
  handleGetAll,
  handleUpdate: [
    handleJoiError({ body: movieValidation.handleUpdate }),
    handleUpdate,
  ],
}
