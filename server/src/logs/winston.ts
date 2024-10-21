import winston from 'winston'

import { varEnv } from '~/configs/variableEnv.config'

export const winstonLoggers = winston.createLogger({
  level: varEnv.NODE_ENV === 'production' ? 'error' : 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'src/logs/errors.log',
      level: 'error',
    }),
  ],
})
