import { UserType } from '~/schemas/user.schema'

declare global {
  namespace Express {
    interface Request {
      files?: Express.Multer.File[]
      user: UserType
      role: number
    }
  }
}
