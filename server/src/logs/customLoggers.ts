import { Request, Response, NextFunction } from 'express'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'

// *****************************************************************************

export const logEvents = async (
  message: string,
  logFileName: string,
): Promise<void> => {
  // Lấy thời gian hiện tại theo định dạng yyyyMMdd HH:mm:ss
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')

  // Tạo chuỗi log với UUID và message truyền vào
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`

  try {
    // Xác định đường dẫn đến thư mục logs
    const logsDir = path.join(__dirname, '..', 'logs')

    // Nếu thư mục logs không tồn tại, tạo thư mục đó
    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir)
    }

    // Thêm nội dung logItem vào file log
    await fsPromises.appendFile(path.join(logsDir, logFileName), logItem)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Gọi hàm logEvents để ghi lại method, url và origin của request
  logEvents(
    `${req.method}\t${req.url}\t${req.headers.origin as string}`,
    'request.log',
  )
  // nếu ok sẽ cho chạy đến middleware tiếp theo
  next()
}
