import jwt from 'jsonwebtoken'
import { varEnv } from '~/configs/variableEnv.config'

import { UserType } from '~/schemas/user.schema'

type TokenOptions = {
  secret: string
  expiresIn: string | number
}

export type TokenPayload = {
  _id: UserType['_id']
  role?: number
}

export const generateToken = (
  payload: TokenPayload,
  options?: TokenOptions,
): string => {
  const { secret = varEnv.JWT_ACCESS_TOKEN_KEY, expiresIn } = options || {}

  return jwt.sign(payload, secret, {
    expiresIn,
  })
}

export const verifyToken = (token: string, secret: string): TokenPayload => {
  return jwt.verify(token, secret) as TokenPayload
}
