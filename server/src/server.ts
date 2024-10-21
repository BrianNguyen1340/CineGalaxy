import mongoose from 'mongoose'

import { application } from '~/app'
import { varEnv } from '~/configs/variableEnv.config'
import { logEvents } from '~/logs/customLoggers'
import { winstonLoggers } from './logs/winston'

const bootstrap = () => {
  const Server = application()

  const port = varEnv.PORT ? Number(varEnv.PORT) : 1340
  const hostname = varEnv.HOST_NAME

  mongoose.connection.once('open', () => {
    Server.listen(port, () => {
      winstonLoggers.info(`Server is running at http://${hostname}:${port}`)
    })
  })

  mongoose.connection.on('error', (error) => {
    logEvents(
      `${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
      'mongoErrror.log',
    )
  })
}

bootstrap()
