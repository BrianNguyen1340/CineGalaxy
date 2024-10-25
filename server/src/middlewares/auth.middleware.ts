import { NextFunction, Request, RequestHandler, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { HttpException } from '~/utils/httpException'
import { varEnv } from '~/configs/variableEnv.config'
import { sendErrorResponse } from '~/utils/responseDataHandler'
import { userModel } from '~/schemas/user.schema'
import { verifyToken } from '~/utils/jsonwebtoken'

// *****************************************************************************

export const authentication: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.AT
    if (!accessToken) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        'Không có access token hợp lệ!',
      )
    }

    const JWT_ACCESS_TOKEN_KEY = varEnv.JWT_ACCESS_TOKEN_KEY
    if (!JWT_ACCESS_TOKEN_KEY) {
      return sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'JWT key không được cấu hình!',
      )
    }

    try {
      const decoded = verifyToken(accessToken, JWT_ACCESS_TOKEN_KEY)

      req.user = await userModel.findById(decoded._id).select('-password')
      if (!req.user) {
        return sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          'Người dùng không tồn tại!',
        )
      }

      next()
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          'Access token đã hết hạn, yêu cầu làm mới!',
        )
      }
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        'Token không hợp lệ hoặc đã hết hạn!',
      )
    }
  } catch (error: any) {
    next(
      new HttpException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || 'An error has occured!',
      ),
    )
  }
}

export const isAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user && req.user.role === 0) {
      next()
    } else {
      return sendErrorResponse(
        res,
        StatusCodes.FORBIDDEN,
        'Không có quyền truy cập!',
      )
    }
  } catch (error: any) {
    next(
      new HttpException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || 'An error has occured!',
      ),
    )
  }
}

export const isManager: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user && req.user.role === 1) {
      next()
    } else {
      return sendErrorResponse(
        res,
        StatusCodes.FORBIDDEN,
        'Không có quyền truy cập!',
      )
    }
  } catch (error: any) {
    next(
      new HttpException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || 'An error has occured!',
      ),
    )
  }
}

export const isCashier: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user && req.user.role === 2) {
      next()
    } else {
      return sendErrorResponse(
        res,
        StatusCodes.FORBIDDEN,
        'Không có quyền truy cập!',
      )
    }
  } catch (error: any) {
    next(
      new HttpException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message || 'An error has occured!',
      ),
    )
  }
}
