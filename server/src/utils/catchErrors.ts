import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { HttpException } from './httpException'

// *****************************************************************************

// Đây là một kiểu dữ liệu đại diện cho một controller bất đồng bộ.
// Nó nhận các đối số req, res, và next, và trả về một Promise mà có thể là một Response hoặc void.
type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>

// hàm bắt lỗi
export const catchErrors =
  (controller: AsyncController): AsyncController =>
  async (req, res, next) => {
    try {
      await controller(req, res, next)
    } catch (error: any) {
      return next(
        new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message),
      )
    }
  }
