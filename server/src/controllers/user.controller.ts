import { RequestHandler } from 'express'
import { handleJoiError } from '~/middlewares/joi.middleware'
import {
    sendErrorResponse,
    sendSuccessResponse,
} from '~/utils/responseDataHandler'
import userService from '~/services/user.service'
import userValidation from '~/validations/user.validation'
import { catchErrors } from '~/utils/catchErrors'

// -------------------------------------------------------------------------------

const profile: RequestHandler = catchErrors(async (req, res) => {
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
})

const getUserByAdmin: RequestHandler = catchErrors(async (req, res) => {})

const getAllUsersByAdmin: RequestHandler = catchErrors(async (req, res) => {})

const updateUserByAdmin: RequestHandler = catchErrors(async (req, res) => {})

const userController = {
    profile,
    updateProfile: [
        handleJoiError({ body: userValidation.updateProfile }),
        updateProfile,
    ],
    getUserByAdmin,
    updateUserByAdmin,
    getAllUsersByAdmin,
}

export default userController
