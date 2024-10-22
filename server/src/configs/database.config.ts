import mongoose from 'mongoose'

import { varEnv } from '~/configs/variableEnv.config'
import { winstonLoggers } from '~/logs/winston'

// *****************************************************************************

// hàm kết nối database
export const connectDatabase = async (): Promise<void> => {
  try {
    // biến kết nối tới database
    const conn = await mongoose.connect(
      varEnv.MONGO_DB_LOCAL_URI, // địa chỉ url của database
    )

    // kiểm tra kết nối
    if (conn.connection.readyState === 1) {
      winstonLoggers.info('Kết nối database thành công!') // thông báo kết nối thành công
    } else {
      winstonLoggers.warn('Kết nối database thất bại!') // thông báo kết nối thất bại
    }
  } catch (error: any) {
    winstonLoggers.error(`Lỗi kết nối database: ${error.message}`) // thông báo lỗi kết nối tìm ẩn
  }
}
