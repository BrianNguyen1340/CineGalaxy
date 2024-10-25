import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ObjectSchema } from 'joi'

// *****************************************************************************

type ValidationDataSchema = {
  body?: ObjectSchema
  params?: ObjectSchema
  query?: ObjectSchema
  headers?: ObjectSchema
  cookies?: ObjectSchema
  files?: ObjectSchema
}

export const handleJoiError = (schema: ValidationDataSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    }

    try {
      if (schema.body) {
        req.body = await schema.body.validateAsync(req.body, validationOptions)
      }
      if (schema.params) {
        req.params = await schema.params.validateAsync(
          req.params,
          validationOptions,
        )
      }
      if (schema.query) {
        req.query = await schema.query.validateAsync(
          req.query,
          validationOptions,
        )
      }
      if (schema.headers) {
        req.headers = await schema.headers.validateAsync(
          req.headers,
          validationOptions,
        )
      }
      if (schema.cookies) {
        req.cookies = await schema.cookies.validateAsync(
          req.cookies,
          validationOptions,
        )
      }
      if (schema.files) {
        req.files = await schema.files.validateAsync(
          req.files,
          validationOptions,
        )
      }
      next()
    } catch (error) {
      if (error instanceof Error && 'details' in error) {
        const errors = (error as any).details.map((err: any) => err.message)
        res.status(StatusCodes.BAD_REQUEST).json({ errors })
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: 'An unexpected error occurred',
        })
      }
    }
  }
}
