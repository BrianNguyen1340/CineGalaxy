import winston from 'winston'

import { varEnv } from '~/configs/variableEnv.config'

// *****************************************************************************

export const winstonLoggers = winston.createLogger({
  // Đây là mức độ log mà logger sẽ ghi lại.
  level: varEnv.NODE_ENV === 'production' ? 'error' : 'debug',

  // Định dạng log được đặt là json
  format: winston.format.json(),

  // Transports là nơi mà log sẽ được gửi tới
  transports: [
    // Console: Gửi các log trực tiếp đến console (terminal), phù hợp cho việc phát triển và theo dõi trực tiếp.
    new winston.transports.Console(),
    //  Ghi lại các log ở mức error vào file src/logs/errors.log. Chỉ những log có mức error trở lên mới được ghi vào file này.
    new winston.transports.File({
      filename: 'src/logs/errors.log',
      level: 'error',
    }),
  ],
})
