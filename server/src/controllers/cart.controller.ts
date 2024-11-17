import { RequestHandler } from 'express'
// import { Types } from 'mongoose'

import {
  sendErrorResponse,
  sendSuccessResponse,
} from '~/utils/responseDataHandler'
import { catchErrors } from '~/utils/catchErrors'
import { cartService } from '~/services/cart.service'

const addToCart: RequestHandler = catchErrors(async (req, res) => {
  if (!req.user || !req.user._id) {
    return sendErrorResponse(res, 400, 'Không tìm thấy ID người dùng!')
  }

  const { _id } = req.user
  const { productId } = req.body

  const response = await cartService.addToCart(_id, productId)
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

const getCartProducts: RequestHandler = catchErrors(async (req, res) => {
  if (!req.user || !req.user._id) {
    return sendErrorResponse(res, 400, 'Không tìm thấy ID người dùng!')
  }

  const { _id } = req.user

  const response = await cartService.getCartProducts(_id)
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

const removeAllFromCart: RequestHandler = catchErrors(async (req, res) => {
  if (!req.user || !req.user._id) {
    return sendErrorResponse(res, 400, 'Không tìm thấy ID người dùng!')
  }

  const { _id } = req.user
  const { productId } = req.body

  const response = await cartService.removeAllFromCart(_id, productId)
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

const updateQuantity: RequestHandler = catchErrors(async (req, res) => {
  if (!req.user || !req.user._id) {
    return sendErrorResponse(res, 400, 'Không tìm thấy ID người dùng!')
  }

  const { _id } = req.user
  const { productId, quantity } = req.body

  const response = await cartService.updateQuantity(_id, productId, quantity)
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

export const cartController = {
  addToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProducts,
}
