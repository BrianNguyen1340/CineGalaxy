import { Request, Response, NextFunction } from 'express'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'

export const logEvents = async (
  message: string,
  logFileName: string,
): Promise<void> => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')

  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`

  try {
    const logsDir = path.join(__dirname, '..', 'logs')

    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir)
    }

    await fsPromises.appendFile(path.join(logsDir, logFileName), logItem)
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('Log error!')
  }
}

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logEvents(
    `${req.method}\t${req.url}\t${req.headers.origin as string}`,
    'request.log',
  )
  next()
}
