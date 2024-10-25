import { paths } from './paths'

// *****************************************************************************

export const getTitleFromPathname = (pathname: string) => {
  switch (pathname) {
    case paths.userPaths.home:
      return 'Trang chủ'
    case paths.userPaths.register:
      return 'Đăng ký'
    case paths.userPaths.verifyOtp:
      return 'Xác nhận mã OTP'
    case paths.userPaths.login:
      return 'Đăng nhập'
    case paths.userPaths.forgotPassword:
      return 'Quên mật khẩu'
    case paths.userPaths.register:
      return 'Thay đổi mật khẩu'
    default:
      return 'Trang chủ'
  }
}
