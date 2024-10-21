import { connect } from 'mongoose'

import { varEnv } from '~/configs/variableEnv.config'
import { winstonLoggers } from '~/logs/winston'

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await connect(varEnv.MONGO_DB_LOCAL_URI as string)

    if (conn.connection.readyState === 1) {
      winstonLoggers.info('Kết nối database thành công!')
    } else {
      winstonLoggers.warn('Kết nối database không ổn định.')
    }
  } catch (error: any) {
    winstonLoggers.error(`Lỗi kết nối database: ${error.message}`)
  }
}
