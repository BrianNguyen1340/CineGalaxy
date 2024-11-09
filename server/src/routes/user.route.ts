import { Request, Response, Router } from 'express'
import bcrypt from 'bcrypt'

import userController from '~/controllers/user.controller'
import { authentication, isAdmin } from '~/middlewares/auth.middleware'
import { userModel } from '~/schemas/user.schema'

const router = Router()

router.post('/create-account', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    const response = await userModel.create({
      name,
      email,
      password: hashedPassword,
    })
    res.status(201).json({ response })
  } catch (error) {
    console.log(error)
  }
})

router.get('/profile', [authentication], userController.profile)
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
// router.post(
//   '/create-user',
//   [authentication, isAdmin],
//   userController.createUser,
// )

router.put('/update-password', [authentication], userController.updatePassword)

export const userRouter = router
