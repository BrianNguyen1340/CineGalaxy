import { Server as SocketIOServer } from 'socket.io'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import http from 'http'
import mongoose from 'mongoose'
import path from 'path'

import { varEnv } from '~/configs/variableEnv.config'
import { logEvents } from '~/logs/customLoggers'
import { logger } from '~/logs/customLoggers'
import { errorHandlerMiddleware } from '~/middlewares/error.middleware'
import { validateEnv } from '~/configs/validateEnv.config'
import { connectDatabase } from '~/configs/database.config'
import { corsOptions } from '~/configs/corsOption.config'
import { initAPIRoutes } from '~/routes/ApiRoutes'

const bootstrap = () => {
  const app = express()

  validateEnv()
  connectDatabase()

  const mongoStore = MongoStore.create({
    mongoUrl: varEnv.MONGO_DB_LOCAL_URI,
    collectionName: 'session_temp_user_email',
    ttl: 10 * 60,
    autoRemove: 'native',
  })

  const sessionSecret = varEnv.SESSION_SECRET_KEY

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: mongoStore,
      cookie: {
        secure: varEnv.NODE_ENV === 'production',
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
      },
    }),
  )

  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }))
  app.use(morgan('combined'))
  app.use(cors(corsOptions))
  app.use(helmet())
  app.use(logger)
  app.use(errorHandlerMiddleware)

  initAPIRoutes(app)

  const __dirname = path.resolve()
  app.use('/uploads', express.static(path.join(__dirname + '/uploads')))

  const httpServer = http.createServer(app)
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('disconnect', () => {
      console.log(socket.id)
    })
  })

  const port = varEnv.PORT ? Number(varEnv.PORT) : 1340
  const hostname = varEnv.HOST_NAME

  mongoose.connection.once('open', () => {
    httpServer.listen(port, () => {
      console.log(`Server is running at http://${hostname}:${port}`)
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
