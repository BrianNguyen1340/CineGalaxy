import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { handleJoiError } from '~/middlewares/joi.middleware'
import { authValidation } from '~/validations/auth.validation'
import {
  sendSuccessResponse,
  sendErrorResponse,
} from '~/utils/responseDataHandler'
import { clearAuthCookies, setAuthCookies } from '~/utils/cookies'
import { catchErrors } from '~/utils/catchErrors'
import { authService } from '~/services/auth.service'
import { redis } from '~/configs/redis.config'
import { varEnv } from '~/configs/variableEnv.config'

const register: RequestHandler = catchErrors(async (req, res) => {
  const { email, password, name } = req.body

  if (req.session) {
    req.session.email = email
  }

  const response = await authService.register(email, password, name)
  if (!response.success) {
    return sendErrorResponse(res, response.statusCode, response.message)
  }

  return sendSuccessResponse(res, response.statusCode, response.message)
})

const verifyOTPRegister: RequestHandler = catchErrors(async (req, res) => {
  const { code } = req.body

  const response = await authService.verifyOTPRegister(code)
  if (!response.success) {
    return sendErrorResponse(res, response.statusCode, response.message)
  }

  await new Promise<void>((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(new Error('Xóa session không thành công!'))
      } else {
        res.clearCookie('connect.sid', { path: '/' })
        resolve()
      }
    })
  })

  const accessToken = response.accessToken
  const refreshToken = response.refreshToken
  if (!accessToken || !refreshToken) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Missing access token or refresh token!',
    )
  }

  setAuthCookies({ res, accessToken, refreshToken })

  return sendSuccessResponse(
    res,
    response.statusCode,
    response.message,
    response.data,
  )
})

const resendOTPRegister: RequestHandler = catchErrors(async (req, res) => {
  const { email } = req.session
  if (!email || typeof email !== 'string') {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Không có email hợp lệ trong session!',
    )
  }

  const response = await authService.resendOTPRegister(email)
  if (!response.success) {
    return sendErrorResponse(res, response.statusCode, response.message)
  }

  return sendSuccessResponse(res, response.statusCode, response.message)
})

const googleLogin: RequestHandler = catchErrors(async (req, res) => {
  const { email, name, photoURL } = req.body

  const response = await authService.googleLogin(email, name, photoURL)
  if (!response.success) {
    return sendErrorResponse(res, response.statusCode, response.message)
  }

  const accessToken = response.accessToken
  const refreshToken = response.refreshToken
  if (!accessToken || !refreshToken) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Missing access token or refresh token!',
    )
  }

  setAuthCookies({ res, accessToken, refreshToken })

  return sendSuccessResponse(
    res,
    response.statusCode,
    response.message,
    response.data,
  )
})

const login: RequestHandler = catchErrors(async (req, res) => {
  const { email, password } = req.body

  const response = await authService.login(email, password)
  if (!response.success) {
    return sendErrorResponse(res, response.statusCode, response.message)
  }

  const accessToken = response.accessToken
  const refreshToken = response.refreshToken
  if (!accessToken || !refreshToken) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Missing access token or refresh token!',
    )
  }

  setAuthCookies({ res, accessToken, refreshToken })

  return sendSuccessResponse(
    res,
    response.statusCode,
    response.message,
    response.data,
    response.accessToken,
  )
})

const refresh = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.RT
  if (!refreshToken) {
    return sendErrorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      'No refresh token provided!',
    )
  }

  const decoded = jwt.verify(
    refreshToken,
    varEnv.JWT_REFRESH_TOKEN_KEY,
  ) as JwtPayload
  console.log('Decoded Payload:', decoded)
  console.log('Decoded Payload:', decoded._id)
  const storedToken = await redis.get(`refresh_token:${decoded._id}`)

  if (storedToken !== refreshToken) {
    return sendErrorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      'Invalid refresh token!',
    )
  }

  const accessToken = jwt.sign(
    { _id: decoded._id, role: decoded.role },
    varEnv.JWT_ACCESS_TOKEN_KEY,
    { expiresIn: '1d' },
  )

  res.cookie('AT', accessToken, {
    httpOnly: true,
    secure: varEnv.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })

  return sendSuccessResponse(
    res,
    StatusCodes.OK,
    'Token refreshed successfully!',
  )
})

const forgotPassword: RequestHandler = catchErrors(async (req, res) => {
  const { email } = req.body

  const response = await authService.forgotPassword(email)
  if (!response.success) {
    return sendErrorResponse(res, response.statusCode, response.message)
  }

  return sendSuccessResponse(res, response.statusCode, response.message)
})

const resetPassword: RequestHandler = catchErrors(async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  const response = await authService.resetPassword(token, password)
  if (!response.success) {
    return sendErrorResponse(res, response.statusCode, response.message)
  }

  return sendSuccessResponse(res, response.statusCode, response.message)
})

const logout: RequestHandler = catchErrors(async (req, res) => {
  const accessToken: string = req.cookies.AT
  const refreshToken: string = req.cookies.RT
  if (!accessToken && !refreshToken) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Không có cookie đăng nhập để xóa!',
    )
  }

  clearAuthCookies(res)

  const response = await authService.logout()
  if (!response.success) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Có lỗi trong quá trình đăng xuất!',
    )
  }

  return sendSuccessResponse(res, response.statusCode, response.message)
})

const authController = {
  register: [handleJoiError({ body: authValidation.register }), register],
  verifyOTPRegister: [
    handleJoiError({ body: authValidation.verifyOTPRegister }),
    verifyOTPRegister,
  ],
  resendOTPRegister,
  login: [handleJoiError({ body: authValidation.login }), login],
  forgotPassword: [
    handleJoiError({ body: authValidation.forgotPassword }),
    forgotPassword,
  ],
  resetPassword,
  logout,
  googleLogin: [
    handleJoiError({ body: authValidation.gooleLogin }),
    googleLogin,
  ],
  refresh,
}

export default authController
