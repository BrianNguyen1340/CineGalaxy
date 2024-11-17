import mongoose from 'mongoose'

import { varEnv } from '~/configs/variableEnv.config'

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(varEnv.MONGO_DB_LOCAL_URI)

    if (conn.connection.readyState === 1) {
      console.log('Kết nối database thành công!')
    } else {
      console.log('Kết nối database thất bại!')
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Lỗi kết nối database: ${error.message}`)
    }
    console.log(`Lỗi kết nối database!`)
  }
}
