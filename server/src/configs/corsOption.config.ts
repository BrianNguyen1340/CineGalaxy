import { CorsOptions } from 'cors'

import { varEnv } from './variableEnv.config'

// *****************************************************************************

const allowedOrigins = [varEnv.CLIENT_URI] // danh sách domain được truy cập đến server

// CORS (Cross-Origin Resource Sharing) là một cơ chế bảo mật của trình duyệt cho phép (hoặc từ chối) các tài nguyên trên một trang web được yêu cầu từ một domain khác với domain mà trang đó đang được lưu trữ.
// ví dụ server có địa chỉ là http://localhost:1000 thì các địa chỉ khác sẽ không được truy cập được trừ khi được server đó cho phép

// hàm custom config CORS
export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // kiểm tra xem nguồn (origin) yêu cầu có nằm trong danh sách allowedOrigins không.
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS!'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}
