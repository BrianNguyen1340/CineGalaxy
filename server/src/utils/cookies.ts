import { CookieOptions, Response } from 'express'

import { varEnv } from '~/configs/variableEnv.config'
import { getExpirationTime } from './getExpirationTime'

// *****************************************************************************

const secure = varEnv.NODE_ENV !== 'development'
const refreshTokenPath = '/auth/refresh-token'

// khởi tạo giá trị mặc định của cookie
const defaults: CookieOptions = {
  sameSite: 'strict',
  httpOnly: true,
  secure,
}

// giá trị mặc định của accessToken
const getAccessToken = (): CookieOptions => ({
  ...defaults,
  expires: getExpirationTime(30, 'days'),
})

// giá trị mặc định của refreshToken
const getRefreshToken = (): CookieOptions => ({
  ...defaults,
  expires: getExpirationTime(60, 'days'),
  path: refreshTokenPath,
})

type CookieParams = {
  res: Response
  accessToken: string
  refreshToken: string
}

// hàm set cookie
export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: CookieParams) => {
  if (!accessToken || !refreshToken) {
    throw new Error(
      'Access token and refresh token are required to set cookies.',
    )
  }
  // gán giá trị accessToken và refreshToken vào cookie
  res
    .cookie('AT', accessToken, getAccessToken())
    .cookie('RT', refreshToken, getRefreshToken())
}

// hàm clear cookie
export const clearAuthCookies = (res: Response) =>
  res.clearCookie('AT').clearCookie('RT', { path: refreshTokenPath })
