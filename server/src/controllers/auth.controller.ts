import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { handleJoiError } from '~/middlewares/joi.middleware'
import { authValidation } from '~/validations/auth.validation'
import {
    sendSuccessResponse,
    sendErrorResponse,
} from '~/utils/responseDataHandler'
import { authService } from '~/services/auth.service'
import { clearAuthCookies, setAuthCookies } from '~/utils/cookies'
import { catchErrors } from '~/utils/catchErrors'

const register: RequestHandler = catchErrors(async (req, res) => {
    const { email, password, name } = req.body

    const response = await authService.register({
        email,
        password,
        name,
    })

    if (req.session) {
        req.session.email = email
    }

    if (!response.success) {
        return sendErrorResponse(res, response.statusCode, response.message)
    }

    return sendSuccessResponse(res, response.statusCode, response.message)
})

const verifyOTPRegister: RequestHandler = catchErrors(async (req, res) => {
    const { code } = req.body

    const response = await authService.verifyOTPRegister({ code })

    if (!response.success) {
        return sendErrorResponse(res, response.statusCode, response.message)
    }

    await new Promise<void>((resolve, reject) => {
        req.session.destroy((error: any) => {
            if (error) {
                reject(new Error('Xóa session không thành công!'))
            } else {
                res.clearCookie('connect.sid', { path: '/' })
                resolve()
            }
        })
    })

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

    const response = await authService.resendOTPRegister({ email })
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

    const response = await authService.login({ email, password })
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

const forgotPassword: RequestHandler = catchErrors(async (req, res) => {
    const { email } = req.body

    const response = await authService.forgotPassword({ email })
    if (!response.success) {
        return sendErrorResponse(res, response.statusCode, response.message)
    }

    return sendSuccessResponse(res, response.statusCode, response.message)
})

const resetPassword: RequestHandler = catchErrors(async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const response = await authService.resetPassword({ token, password })
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

const checkEmailExist: RequestHandler = catchErrors(async (req, res) => {
    const { email } = req.body

    const response = await authService.checkEmailExist({ email })
    if (!response.success) {
        return sendErrorResponse(res, response.statusCode, response.message)
    }

    return sendSuccessResponse(res, response.statusCode, response.message)
})

const refreshUserAccessToken = catchErrors(async (req, res) => {
    const refreshToken = req.cookies.RT

    if (!refreshToken) {
        return sendErrorResponse(
            res,
            StatusCodes.UNAUTHORIZED,
            'Refresh token không tồn tại!',
        )
    }

    const response = await authService.refreshUserAccessToken({ refreshToken })
    if (!response.success) {
        return sendErrorResponse(res, response.statusCode, response.message)
    }

    return sendSuccessResponse(
        res,
        response.statusCode,
        response.message,
        response.newAccessToken,
    )
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
    checkEmailExist: [
        handleJoiError({ body: authValidation.checkEmailExist }),
        checkEmailExist,
    ],
    refreshUserAccessToke: [
        handleJoiError({ cookies: authValidation.refreshUserAccessToken }),
        refreshUserAccessToken,
    ],
    googleLogin: [
        handleJoiError({ body: authValidation.gooleLogin }),
        googleLogin,
    ],
}

export default authController
