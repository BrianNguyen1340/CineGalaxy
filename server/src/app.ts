import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import { logger } from '~/logs/customLoggers'
import { errorHandlerMiddleware } from '~/middlewares/errorHandler.middleware'
import { validateEnv } from '~/configs/validateEnv.config'
import { varEnv } from '~/configs/variableEnv.config'
import { connectDatabase } from '~/configs/database.config'
import { corsOptions } from '~/configs/corsOption.config'
import { initAPIRoutes } from '~/routes/ApiRoutes'

export const application = () => {
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

    return app
}
