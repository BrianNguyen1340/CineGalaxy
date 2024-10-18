import { Application, Router } from 'express'

import { authRoute } from './auth.route'
import { userRouter } from './user.route'

const router = Router()

export const initAPIRoutes = (app: Application) => {
    router.use('/auth', authRoute)
    router.use('/user', userRouter)

    return app.use('/api/v1', router)
}
