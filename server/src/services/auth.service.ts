/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'

import {
  generateRandomNumber,
  generateRandomToken,
} from '~/utils/generateRandomCode'
import { getExpirationTime } from '~/utils/getExpirationTime'
import { varEnv } from '~/configs/variableEnv.config'
import { UserType, userModel } from '~/schemas/user.schema'
import { verificationCodeRegister } from '~/schemas/verificationCodeRegister.schema'
import { generateToken } from '~/utils/jsonwebtoken'
import {
  sendPasswordResetEmail,
  sendVerificationOTPRegister,
} from '~/emails/nodemailerSendEmail'

// hàm đăng ký
const register = async (
  email: string,
  password: string,
  name: string,
): Promise<{ success: boolean; message: string; statusCode: number }> => {
  try {
    const checkUserExist = await userModel.exists({
      email,
    })
    if (checkUserExist) {
      return {
        success: false,
        statusCode: StatusCodes.CONFLICT,
        message: 'Tài khoản đã tồn tại!',
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const verificationToken = generateRandomNumber(8)
    const expiresAt = getExpirationTime(10, 'minutes')

    const tempUser = await verificationCodeRegister.create({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: expiresAt,
    })
    if (!tempUser) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Có lỗi khi tạo người dùng tạm!',
      }
    }

    const emailResponse = await sendVerificationOTPRegister({
      email,
      verificationToken,
    })

    return {
      success: emailResponse.success,
      message: emailResponse.message,
      statusCode: emailResponse.statusCode,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

const verifyOTPRegister = async (
  code: string,
): Promise<{
  success: boolean
  message: string
  data?: Partial<UserType>
  statusCode: number
}> => {
  try {
    const tempUser = await verificationCodeRegister.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    })
    if (!tempUser) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Mã OTP không hợp lệ hoặc hết hạn!',
      }
    }

    const newUser = await userModel.create({
      email: tempUser.email,
      password: tempUser.password,
      name: tempUser.name,
      isVerified: true,
    })

    await verificationCodeRegister.deleteOne({ _id: tempUser._id })

    const { password, isVerified, isBlocked, __v, ...data } = newUser.toObject()

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Xác nhận tài khoản thành công. Vui lòng đăng nhập!',
      data,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

// hàm gửi lại otp
const resendOTPRegister = async (
  email: string,
): Promise<{ success: boolean; message: string; statusCode: number }> => {
  try {
    const verificationToken = generateRandomNumber(8)
    const expiresAt = getExpirationTime(10, 'minutes')

    const newOTP = await verificationCodeRegister.findOneAndUpdate(
      { email },
      {
        verificationToken,
        verificationTokenExpiresAt: expiresAt,
      },
      { new: true },
    )
    if (!newOTP) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Có lỗi trong quá trình cập nhật OTP!',
      }
    }

    const emailResponse = await sendVerificationOTPRegister({
      email: newOTP.email,
      verificationToken,
    })

    return {
      success: emailResponse.success,
      statusCode: emailResponse.statusCode,
      message: 'Gửi lại mã xác nhận tài khoản thành công!',
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

// hàm đăng nhập với google
const googleLogin = async (
  email: string,
  name: string,
  photoURL: string,
): Promise<{
  success: boolean
  statusCode: number
  message: string
  data?: Partial<UserType>
  accessToken?: string
  refreshToken?: string
}> => {
  try {
    const user = await userModel.findOne({
      email,
    })
    if (user?.isBlocked === true) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message:
          'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên để hỗ trợ!',
      }
    }

    if (user) {
      if (user.photoURL !== photoURL) {
        user.photoURL = photoURL
      }

      const accessToken = generateToken(
        {
          _id: user._id,
          role: user.role,
        },
        { secret: varEnv.JWT_ACCESS_TOKEN_KEY, expiresIn: '7d' },
      )
      const refreshToken = generateToken(
        { _id: user._id },
        { secret: varEnv.JWT_REFRESH_TOKEN_KEY, expiresIn: '30d' },
      )

      user.lastLogin = new Date()
      await user.save()

      const { password, isVerified, isBlocked, __v, ...data } = user.toObject()

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Đăng nhập thành công!',
        accessToken,
        refreshToken,
        data,
      }
    } else {
      const generatedPassword = Math.random().toString(36).slice(-16)
      const hashedPassword = await bcrypt.hash(generatedPassword, 12)

      const newUser = await userModel.create({
        name: name?.split(' ').join('').toLowerCase(),
        email,
        password: hashedPassword,
        photoURL,
      })
      if (!newUser) {
        return {
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Tạo user thất bại!',
        }
      }

      const accessToken = generateToken(
        {
          _id: newUser._id,
          role: newUser.role,
        },
        { secret: varEnv.JWT_ACCESS_TOKEN_KEY, expiresIn: '7d' },
      )
      const refreshToken = generateToken(
        { _id: newUser._id },
        { secret: varEnv.JWT_REFRESH_TOKEN_KEY, expiresIn: '30d' },
      )

      newUser.lastLogin = new Date()
      await newUser.save()

      const { password, isVerified, isBlocked, __v, ...data } =
        newUser.toObject()

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Đăng nhập thành công!',
        accessToken,
        refreshToken,
        data,
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

// hàm đăng nhập
const login = async (
  email: string,
  enteredPassword: string,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<UserType>
  accessToken?: string
  refreshToken?: string
}> => {
  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Tài khoản không tồn tại!',
      }
    }

    if (user.isBlocked === true) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message:
          'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên để hỗ trợ!',
      }
    }

    const isMatch = await bcrypt.compare(enteredPassword, user.password)
    if (!isMatch) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Sai thông tin đăng nhập!',
      }
    }

    const accessToken = generateToken(
      {
        _id: user._id,
        role: user.role,
      },
      { secret: varEnv.JWT_ACCESS_TOKEN_KEY, expiresIn: '7d' },
    )
    const refreshToken = generateToken(
      { _id: user._id },
      { secret: varEnv.JWT_REFRESH_TOKEN_KEY, expiresIn: '30d' },
    )

    user.lastLogin = new Date()
    await user.save()

    const { password, isVerified, isBlocked, __v, ...data } = user.toObject()

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Đăng nhập thành công!',
      accessToken,
      refreshToken,
      data,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

// hàm quên mật khẩu
const forgotPassword = async (
  email: string,
): Promise<{ success: boolean; message: string; statusCode: number }> => {
  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Tài khoản không tồn tại!',
      }
    }

    const resetPasswordToken = generateRandomToken(20)
    const expiresAt = getExpirationTime(10, 'minutes')
    const resetPasswordExpiresAt = expiresAt

    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordExpiresAt = resetPasswordExpiresAt

    await user.save()

    const resetUrl = `${varEnv.CLIENT_URI}/reset-password/${resetPasswordToken}`

    const emailResponse = await sendPasswordResetEmail({
      email,
      resetUrl,
    })

    return {
      success: emailResponse.success,
      message: emailResponse.message,
      statusCode: emailResponse.statusCode,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

// hàm xác thực token khi thay đổi mật khẩu
const resetPassword = async (
  token: string,
  password: string,
): Promise<{ success: boolean; message: string; statusCode: number }> => {
  try {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    })
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Token không hợp lệ hoặc hết hạn!',
      }
    }

    const hashedPassword = await bcrypt.hash(user.password, 12)

    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpiresAt = undefined

    await user.save()

    return {
      success: true,
      message: 'Thay đổi mật khẩu thành công!',
      statusCode: StatusCodes.OK,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

// đăng xuất
const logout = async (): Promise<{
  success: boolean
  message: string
  statusCode: number
}> => {
  try {
    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Đăng xuất thành công!',
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

export const authService = {
  register,
  verifyOTPRegister,
  resendOTPRegister,
  login,
  forgotPassword,
  resetPassword,
  logout,
  googleLogin,
}
