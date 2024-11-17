import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { HttpException } from './httpException'

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>

export const catchErrors =
  (controller: AsyncController): AsyncController =>
  async (req, res, next) => {
    try {
      await controller(req, res, next)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return next(
          new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message),
        )
      }
      return next(
        new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error!'),
      )
    }
  }
