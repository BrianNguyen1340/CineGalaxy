import { StatusCodes } from 'http-status-codes'
import nodemailer, { Transporter } from 'nodemailer'

import { varEnv } from '~/configs/variableEnv.config'

// *****************************************************************************

// khai báo kiểu dữ liệu của email
type EmailOptions = {
  to: string // gửi cho ai (email người nhận)
  subject: string // chủ đề email
  text?: string // nội dung văn bản thuần của email
  html?: string // nội dung HTML (tùy chọn) để hiển thị đẹp hơn
}

// cấu hình dịch vụ gmail
const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail', // Dịch vụ Gmail.
  auth: {
    // Xác thực với Gmail bằng tên người dùng và mật khẩu.
    user: varEnv.EMAIL_USERNAME,
    pass: varEnv.EMAIL_PASSWORD,
  },
})

// hàm gửi email
export const sendEmail = async (options: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: `CineGalaxy <noreply@cinegalaxy.com>`,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html || '',
    })
  } catch (error: unknown) {
    // xử lý lỗi không xác định
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
