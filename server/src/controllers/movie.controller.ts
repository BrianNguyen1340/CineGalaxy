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
import slugify from 'slugify'

const handleCreate: RequestHandler = catchErrors(async (req, res) => {
  const {
    name,
    description,
    director,
    releaseDate,
    duration,
    poster,
    trailer,
    movieRating,
    subtitle,
    movieFormat,
    genres,
  } = req.body

  const slug = slugify(name, {
    lower: true,
    strict: true,
    replacement: '-',
  })

  const response = await movieService.handleCreate(
    name,
    slug,
    description,
    director,
    releaseDate,
    duration,
    poster,
    trailer,
    movieRating,
    subtitle,
    movieFormat,
    genres,
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

const handleGetAll: RequestHandler = catchErrors(async (req, res) => {
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

const handleUpdate: RequestHandler = catchErrors(async (req, res) => {
  const { id } = req.params
  const {
    name,
    description,
    director,
    releaseDate,
    duration,
    poster,
    trailer,
    movieRating,
    subtitle,
    movieFormat,
    genreId,
  } = req.body

  const objectID = new Types.ObjectId(id)

  const response = await movieService.handleUpdate(
    objectID,
    name,
    description,
    director,
    releaseDate,
    duration,
    poster,
    trailer,
    movieRating,
    subtitle,
    movieFormat,
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
