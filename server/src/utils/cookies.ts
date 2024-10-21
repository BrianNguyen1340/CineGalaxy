import { CookieOptions, Response } from 'express'

import { varEnv } from '~/configs/variableEnv.config'
import { getExpirationTime } from './getExpirationTime'

const secure = varEnv.NODE_ENV !== 'development'
const refreshTokenPath = '/auth/refresh-token'

const defaults: CookieOptions = {
  sameSite: 'strict',
  httpOnly: true,
  secure,
}

const getAccessToken = (): CookieOptions => ({
  ...defaults,
  expires: getExpirationTime(1, 'days'),
})

const getRefreshToken = (): CookieOptions => ({
  ...defaults,
  expires: getExpirationTime(7, 'days'),
  path: refreshTokenPath,
})

type CookieParams = {
  res: Response
  accessToken: string
  refreshToken: string
}
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
  res
    .cookie('AT', accessToken, getAccessToken())
    .cookie('RT', refreshToken, getRefreshToken())
}

export const clearAuthCookies = (res: Response) =>
  res.clearCookie('AT').clearCookie('RT', { path: refreshTokenPath })
