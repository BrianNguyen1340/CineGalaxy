import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { varEnv } from '~/configs/variableEnv.config'
import { logEvents } from '~/logs/customLoggers'

// *****************************************************************************

type CustomError = Error & {
  statusCode?: number
}

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logEvents(
    `${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'requests.log',
  )

  if (!error.statusCode) {
    error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }

  const responseError = {
    statusCode: error.statusCode,
    message: error.message || StatusCodes[error.statusCode],
    stack: error.stack,
  }

  if (varEnv.NODE_ENV !== 'development') {
    delete responseError.stack
  }

  res.status(responseError.statusCode).json(responseError)
}
