import { Application, Router } from 'express'

import { authRoute } from './auth.route'
import { userRouter } from './user.route'
import { categoryRoute } from './category.route'

const router = Router()

export const initAPIRoutes = (app: Application) => {
    router.use('/auth', authRoute)
    router.use('/user', userRouter)
    router.use('/category', categoryRoute)

    return app.use('/api/v1', router)
}
