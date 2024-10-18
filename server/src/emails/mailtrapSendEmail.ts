// import { isEmail } from 'validator'
// import { StatusCodes } from 'http-status-codes'

// import {
//     PASSWORD_RESET_REQUEST_TEMPLATE,
//     PASSWORD_RESET_SUCCESS_TEMPLATE,
//     VERIFICATION_EMAIL_TEMPLATE,
// } from './emailTemplate'
// import { mailtrapClient, sender } from './mailtrapConfig'

// type SendVerificationEmailParams = {
//     email: string
//     verificationToken: string
// }

// export const sendVerificationEmail = async (
//     params: SendVerificationEmailParams,
// ): Promise<{ success: boolean; message: string; statusCode: number }> => {
//     const recipient = [{ email: params.email }]

//     if (!isEmail(params.email)) {
//         return {
//             success: false,
//             statusCode: StatusCodes.BAD_REQUEST,
//             message: 'Email không hợp lệ!',
//         }
//     }

//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: 'Xác nhận email của bạn!',
//             html: VERIFICATION_EMAIL_TEMPLATE.replace(
//                 '{verificationCode}',
//                 params.verificationToken,
//             ),
//             category: 'Xác nhận email!',
//         })
//         if (!response || !response.success) {
//             return {
//                 success: false,
//                 statusCode: StatusCodes.BAD_REQUEST,
//                 message: 'Có lỗi diễn ra trong quá trình gửi email',
//             }
//         }

//         return {
//             success: true,
//             statusCode: StatusCodes.CREATED,
//             message:
//                 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản!',
//         }
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             return {
//                 success: false,
//                 message: `Lỗi hệ thống: ${error.message}`,
//                 statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//             }
//         }
//         return {
//             success: false,
//             message: 'Đã xảy ra lỗi không xác định!',
//             statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//         }
//     }
// }

// type SendWelcomeEmailParams = {
//     email: string
//     name: string
// }

// export const sendWelcomeEmail = async (
//     params: SendWelcomeEmailParams,
// ): Promise<{ success: boolean; message: string; statusCode: number }> => {
//     const recipient = [{ email: params.email }]

//     if (!isEmail(params.email)) {
//         return {
//             success: false,
//             statusCode: StatusCodes.BAD_REQUEST,
//             message: 'Email không hợp lệ!',
//         }
//     }

//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             template_uuid: '029b2be9-b28d-4744-951c-aea6ed290613',
//             template_variables: {
//                 company_info_name: 'CineGalaxy',
//                 name: params.name,
//             },
//         })
//         if (!response || !response.success) {
//             return {
//                 success: false,
//                 statusCode: StatusCodes.BAD_REQUEST,
//                 message: 'Có lỗi diễn ra trong quá trình gửi email',
//             }
//         }

//         return {
//             success: true,
//             statusCode: StatusCodes.CREATED,
//             message: 'Đăng ký tài khoản thành công!',
//         }
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             return {
//                 success: false,
//                 message: `Lỗi hệ thống: ${error.message}`,
//                 statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//             }
//         }
//         return {
//             success: false,
//             message: 'Đã xảy ra lỗi không xác định!',
//             statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//         }
//     }
// }

// type SendPasswordResetEmail = {
//     email: string
//     resetURL: string
// }

// export const sendPasswordResetEmail = async (
//     params: SendPasswordResetEmail,
// ): Promise<{ success: boolean; message: string; statusCode: number }> => {
//     const recipient = [{ email: params.email }]

//     if (!isEmail(params.email)) {
//         return {
//             success: false,
//             statusCode: StatusCodes.BAD_REQUEST,
//             message: 'Email không hợp lệ!',
//         }
//     }

//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: 'Đặt lại mật khẩu của bạn!',
//             html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
//                 '{resetURL}',
//                 params.resetURL,
//             ),
//             category: 'Đặt lại mật khẩu',
//         })
//         if (!response || !response.success) {
//             return {
//                 success: false,
//                 statusCode: StatusCodes.BAD_REQUEST,
//                 message: 'Có lỗi diễn ra trong quá trình gửi email',
//             }
//         }

//         return {
//             success: true,
//             statusCode: StatusCodes.CREATED,
//             message: 'Liên kết đặt lại mật khẩu đã được gửi tới email của bạn!',
//         }
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             return {
//                 success: false,
//                 message: `Lỗi hệ thống: ${error.message}`,
//                 statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//             }
//         }
//         return {
//             success: false,
//             message: 'Đã xảy ra lỗi không xác định!',
//             statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//         }
//     }
// }

// type SendResetSuccessEmail = {
//     email: string
// }

// export const sendResetSuccessEmail = async (
//     params: SendResetSuccessEmail,
// ): Promise<{ success: boolean; message: string; statusCode: number }> => {
//     const recipient = [{ email: params.email }]

//     if (!isEmail(params.email)) {
//         throw new Error('Địa chỉ email không hợp lệ.')
//     }

//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: 'Đặt lại mật khẩu thành công!',
//             html: PASSWORD_RESET_SUCCESS_TEMPLATE,
//             category: 'Đặt lại mật khẩu',
//         })
//         if (!response || !response.success) {
//             return {
//                 success: false,
//                 statusCode: StatusCodes.BAD_REQUEST,
//                 message: 'Có lỗi diễn ra trong quá trình gửi email',
//             }
//         }

//         return {
//             success: true,
//             statusCode: StatusCodes.OK,
//             message: 'Đã gửi email đặt lại mật khẩu thành công!',
//         }
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             return {
//                 success: false,
//                 message: `Lỗi hệ thống: ${error.message}`,
//                 statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//             }
//         }
//         return {
//             success: false,
//             message: 'Đã xảy ra lỗi không xác định!',
//             statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//         }
//     }
// }
