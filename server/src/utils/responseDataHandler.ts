import { Response } from 'express'

type ErrorResponse = {
  success: boolean
  message: string
}

type SuccessResponse<T = any> = {
  success: boolean
  message: string
  data?: T
}

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  } as ErrorResponse)
}

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  } as SuccessResponse<T>)
}
