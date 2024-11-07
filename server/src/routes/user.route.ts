import { Router } from 'express'

import userController from '~/controllers/user.controller'
import {
  authentication,
  isAdmin,
  authenticated,
} from '~/middlewares/auth.middleware'

const router = Router()

router.get('/profile', [authenticated], userController.profile)
router.put('/update-profile', [authentication], userController.updateProfile)
router.get('/get-user-by-admin/:id', userController.getUserByAdmin)
router.get('/get-all-users-by-admin', userController.getAllUsersByAdmin)
router.put('/update-user-by-admin/:id', userController.updateUserByAdmin)
router.put(
  '/block-account/:id',
  [authentication, isAdmin],
  userController.blockAccount,
)
router.put(
  '/unblock-account/:id',
  [authentication, isAdmin],
  userController.unblockAccount,
)
router.post(
  '/create-user',
  [authentication, isAdmin],
  userController.createUser,
)

export const userRouter = router
