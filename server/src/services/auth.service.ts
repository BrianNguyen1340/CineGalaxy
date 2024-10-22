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

// *****************************************************************************

// hàm đăng ký
const register = async (
  email: string,
  password: string,
  name: string,
): Promise<{ success: boolean; message: string; statusCode: number }> => {
  try {
    // kiểm tra user có tồn tại
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

    // mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 12)

    // tạo otp gồm 8 số
    const verificationToken = generateRandomNumber(8)
    // thời gian sống của otp
    const expiresAt = getExpirationTime(10, 'minutes')

    // lưu tạm giá trị của user
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

    // gửi email xác thực đăng ký
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
    // kiểm tra người dùng tạm có otp hợp lệ đã được gửi trước đó?
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

    // gán giá trị người dùng tạm lưu vào bảng user chính
    const newUser = await userModel.create({
      email: tempUser.email,
      password: tempUser.password,
      name: tempUser.name,
      isVerified: true,
    })

    // xóa otp của người dùng tạm đã đăng ký thành công
    await verificationCodeRegister.deleteOne({ _id: tempUser._id })

    const {
      password,
      isVerified,
      createdAt,
      updatedAt,
      isBlocked,
      __v,
      ...data
    } = newUser.toObject()

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
    // tạo otp gồm 8 số
    const verificationToken = generateRandomNumber(8)
    // thời gian sống của otp
    const expiresAt = getExpirationTime(10, 'minutes')

    // tạo otp mới
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

    // gửi lại email xác thực đăng ký
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
    // kiểm tra user có tồn tại
    const user = await userModel.findOne({
      email,
    })
    // kiểm tra tài khoản có bị khóa
    if (user?.isBlocked === true) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message:
          'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên để hỗ trợ!',
      }
    }

    // nếu có user
    if (user) {
      // cập nhật giá trị của avatar người dùng
      if (user.photoURL !== photoURL) {
        user.photoURL = photoURL
      }

      // tạo giá trị accessToken
      const accessToken = generateToken(
        {
          _id: user._id,
          role: user.role,
        },
        { secret: varEnv.JWT_ACCESS_TOKEN_KEY, expiresIn: '1d' },
      )
      // tạo giá trị refreshToken
      const refreshToken = generateToken(
        { _id: user._id },
        { secret: varEnv.JWT_REFRESH_TOKEN_KEY, expiresIn: '7d' },
      )

      // lưu lại thời gian đăng nhập mới nhất
      user.lastLogin = new Date()
      await user.save()

      const {
        password,
        createdAt,
        updatedAt,
        isVerified,
        isBlocked,
        __v,
        ...data
      } = user.toObject()

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Đăng nhập thành công!',
        accessToken,
        refreshToken,
        data,
      }
    } else {
      // nếu user chưa tồn tại

      // tạo ngẫu nhiên mật khẩu
      const generatedPassword = Math.random().toString(36).slice(-16)
      // mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(generatedPassword, 12)

      // lưu giá trị của user vào csdl
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
        { secret: varEnv.JWT_ACCESS_TOKEN_KEY, expiresIn: '1d' },
      )
      const refreshToken = generateToken(
        { _id: newUser._id },
        { secret: varEnv.JWT_REFRESH_TOKEN_KEY, expiresIn: '7d' },
      )

      newUser.lastLogin = new Date()
      await newUser.save()

      const {
        password,
        createdAt,
        updatedAt,
        isVerified,
        isBlocked,
        __v,
        ...data
      } = newUser.toObject()

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
    // kiểm tra user có tồn tại
    const user = await userModel.findOne({ email })
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Tài khoản không tồn tại!',
      }
    }

    // nếu user bị khóa
    if (user.isBlocked === true) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message:
          'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên để hỗ trợ!',
      }
    }

    // kiểm tra mật khẩu khi đăng nhập
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
      { secret: varEnv.JWT_ACCESS_TOKEN_KEY, expiresIn: '1d' },
    )
    const refreshToken = generateToken(
      { _id: user._id },
      { secret: varEnv.JWT_REFRESH_TOKEN_KEY, expiresIn: '7d' },
    )

    user.lastLogin = new Date()
    await user.save()

    const {
      password,
      createdAt,
      updatedAt,
      isVerified,
      isBlocked,
      __v,
      ...data
    } = user.toObject()

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
    // kiểm tra user có tồn tại
    const user = await userModel.findOne({ email })
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Tài khoản không tồn tại!',
      }
    }

    // tạo token reset password
    const resetPasswordToken = generateRandomToken(20)
    // thời gian token sống
    const expiresAt = getExpirationTime(10, 'minutes')
    const resetPasswordExpiresAt = expiresAt

    // lưu token và thời gian sống vào csdl
    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordExpiresAt = resetPasswordExpiresAt

    await user.save()

    // giá trị token sẽ được gửi tới phía client
    const resetUrl = `${varEnv.CLIENT_URI}/reset-password/${resetPasswordToken}`

    // gửi email xác nhận yêu cầu thay đổi mật khẩu
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
    // kiểm tra token đã được lưu trước đó
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

    // mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(user.password, 12)

    // lưu mật khẩu mới vào csdl
    user.password = hashedPassword
    user.resetPasswordToken = undefined // xóa token đã lưu
    user.resetPasswordExpiresAt = undefined // xóa thời gian

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
