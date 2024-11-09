import { RequestHandler } from 'express'
import { handleJoiError } from '~/middlewares/joi.middleware'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import userService from '~/services/user.service'
import userValidation from '~/validations/user.validation'
import { catchErrors } from '~/utils/catchErrors'
import { Types } from 'mongoose'

const profile: RequestHandler = catchErrors(async (req, res) => {
  if (!req.user || !req.user._id) {
    return sendErrorResponse(res, 400, 'Không tìm thấy ID người dùng!')
  }

  const { _id } = req.user

  const response = await userService.profile(_id)
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

const updateProfile: RequestHandler = catchErrors(async (req, res) => {
  if (!req.user || !req.user._id) {
    return sendErrorResponse(res, 400, 'Không tìm thấy ID người dùng!')
  }

  const _id = req.user._id
  const { name, email, phone, gender, address, photoURL } = req.body

  const response = await userService.updateProfile(
    _id,
    name,
    email,
    phone,
    gender,
    address,
    photoURL,
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

const getUserByAdmin: RequestHandler = catchErrors(async (req, res) => {
  const { id } = req.params

  const objectId = new Types.ObjectId(id)

  const response = await userService.getUserByAdmin(objectId)
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

const getAllUsersByAdmin: RequestHandler = catchErrors(async (req, res) => {
  const response = await userService.getAllUsersByAdmin()
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

const updateUserByAdmin: RequestHandler = catchErrors(async (req, res) => {
  const { id } = req.params

  const objectID = new Types.ObjectId(id)

  const response = await userService.updateUserByAdmin(objectID, req.body)
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

const blockAccount = catchErrors(async (req, res) => {
  const { id } = req.params

  const objectId = new Types.ObjectId(id)

  const response = await userService.blockAccount(objectId)
  if (!response.success) {
    return sendErrorResponse(res, response.statusCode, response.message)
  }

  return sendSuccessResponse(res, response.statusCode, response.message)
})

const unblockAccount = catchErrors(async (req, res) => {
  const { id } = req.params

  const objectId = new Types.ObjectId(id)

  const response = await userService.unblockAccount(objectId)
  if (!response.success) {
    return sendErrorResponse(res, response.statusCode, response.message)
  }

  return sendSuccessResponse(res, response.statusCode, response.message)
})

const createUser = catchErrors(async (req, res) => {
  const { email, name, password, role } = req.body

  const response = await userService.createUserByAdmin(
    email,
    name,
    password,
    role,
  )
  if (!response.success) {
    return sendErrorResponse(res, response.statusCode, response.message)
  }

  return sendSuccessResponse(res, response.statusCode, response.message)
})

const userController = {
  profile,
  updateProfile: [
    handleJoiError({ body: userValidation.updateProfile }),
    updateProfile,
  ],
  getUserByAdmin,
  updateUserByAdmin,
  getAllUsersByAdmin,
  blockAccount,
  unblockAccount,
  createUser: [handleJoiError({ body: userValidation.createUser }), createUser],
}

export default userController
