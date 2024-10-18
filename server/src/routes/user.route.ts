import { Router } from 'express'

import { varEnv } from '~/configs/variableEnv.config'

import userController from '~/controllers/user.controller'
import { authentication } from '~/middlewares/auth.middleware'

const router = Router()

router.get('/profile', [authentication], userController.profile)
router.put('/update-profile', [authentication], userController.updateProfile)

export const userRouter = router
