import { CorsOptions } from 'cors'

import { varEnv } from './variableEnv.config'

// *****************************************************************************

const allowedOrigins = [varEnv.CLIENT_URI]

export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS!'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}
