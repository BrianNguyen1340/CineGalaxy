import { StatusCodes } from 'http-status-codes'
import { isEmail } from 'validator'

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from './emailTemplate'
import { sendEmail } from './nodemailerConfig'

// *****************************************************************************

// khai báo kiểu dữ liệu
type SendVerificationEmailData = {
  email: string
  verificationToken: string
}

// hàm gửi xác nhận otp khi đăng ký tài khoản
export const sendVerificationOTPRegister = async (
  reqBody: SendVerificationEmailData,
): Promise<{ success: boolean; message: string; statusCode: number }> => {
  try {
    // thông tin email và token yêu cầu từ phía client
    const { email, verificationToken } = reqBody

    if (!isEmail(email)) {
      return {
        success: false,
        message: 'Email không hợp lệ.',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
      '{verificationCode}',
      verificationToken,
    )

    await sendEmail({
      to: email,
      subject: 'Xác thực tài khoản của bạn',
      html: htmlContent,
    })

    return {
      success: true,
      message:
        'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản!',
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

type SendPasswordResetEmail = {
  email: string
  resetUrl: string
}

// hàm gửi email thay đổi mật khẩu
export const sendPasswordResetEmail = async (
  reqBody: SendPasswordResetEmail,
) => {
  try {
    // thông tin email và url kèm token yêu cầu từ phía client
    const { email, resetUrl } = reqBody

    if (!isEmail(email)) {
      return {
        success: false,
        message: 'Email không hợp lệ.',
        statusCode: StatusCodes.BAD_REQUEST,
      }
    }

    const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      '{resetURL}',
      resetUrl,
    )

    await sendEmail({
      to: email,
      subject: 'Thay đổi mật khẩu của bạn!',
      html: htmlContent,
    })

    return {
      success: true,
      message: 'Đã gửi email xác nhận đặt lại mật khẩu đã được gửi!',
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
