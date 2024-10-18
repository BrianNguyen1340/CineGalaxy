import { NextFunction, Request, RequestHandler, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { HttpException } from '~/utils/httpException'
import { handleJoiError } from '~/middlewares/joi.middleware'
import {
    sendErrorResponse,
    sendSuccessResponse,
} from '~/utils/responseDataHandler'
import userService from '~/services/user.service'
import userValidation from '~/validations/user.validation'

// -------------------------------------------------------------------------------

const profile: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            return next(
                new HttpException(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    error.message || 'An error has occured!',
                ),
            )
        }
        return next(
            new HttpException(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'An unknown error has occurred!',
            ),
        )
    }
}

const updateProfile: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
        const userId = req.user._id
        const userInfo = req.body

        const response = await userService.updateProfile(userId, userInfo)
        if (!response.success) {
            return sendErrorResponse(res, response.statusCode, response.message)
        }

        return sendSuccessResponse(
            res,
            response.statusCode,
            response.message,
            response.data,
        )
    } catch (error: unknown) {
        if (error instanceof Error) {
            return next(
                new HttpException(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    error.message || 'An error has occured!',
                ),
            )
        }
        return next(
            new HttpException(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'An unknown error has occurred!',
            ),
        )
    }
}

const getUserByAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
    } catch (error: unknown) {
        if (error instanceof Error) {
            return next(
                new HttpException(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    error.message || 'An error has occured!',
                ),
            )
        }
        return next(
            new HttpException(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'An unknown error has occurred!',
            ),
        )
    }
}

const updateUserByAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    try {
    } catch (error: unknown) {
        if (error instanceof Error) {
            return next(
                new HttpException(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    error.message || 'An error has occured!',
                ),
            )
        }
        return next(
            new HttpException(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'An unknown error has occurred!',
            ),
        )
    }
}

// * BLOCK ACCOUNT CONTROLLER

// * UNBLOCK ACCOUNT CONTROLLER

const userController = {
    profile,
    updateProfile: [
        handleJoiError({ body: userValidation.updateProfile }),
        updateProfile,
    ],
    getUserByAdmin,
    updateUserByAdmin,
}

export default userController
