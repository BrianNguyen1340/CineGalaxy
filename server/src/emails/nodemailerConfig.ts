import { StatusCodes } from 'http-status-codes'
import nodemailer, { Transporter } from 'nodemailer'

import { varEnv } from '~/configs/variableEnv.config'

type EmailOptions = {
  to: string
  subject: string
  text?: string
  html?: string
}

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: varEnv.EMAIL_USERNAME,
    pass: varEnv.EMAIL_PASSWORD,
  },
})

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
