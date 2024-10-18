import { Router } from 'express'
import bcrypt from 'bcrypt'

import authController from '~/controllers/auth.controller'
import { loginLimiter } from '~/middlewares/loginLimiter.middleware'
import { userModel } from '~/schemas/user.schema'

const router = Router()

router.post('/create-account', async (req, res) => {
    const { email, name, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await userModel.create({
        email,
        name,
        password: hashedPassword,
    })

    return res.status(201).json(result)
})

router.post('/register', authController.register)
router.post('/verify-otp-register', authController.verifyOTPRegister)
router.post('/reset-password/:token', authController.resendOTPRegister)
router.post('/google-login', authController.googleLogin)
router.post('/login', [loginLimiter], authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)
router.post('/logout', authController.logout)
router.post('/check-email-exist', authController.checkEmailExist)

export const authRoute = router
