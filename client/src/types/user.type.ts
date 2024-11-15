export type UserType = {
  readonly _id: string
  email: string
  name: string
  phone?: string
  gender?: string
  address?: string
  photoURL?: string
  lastLogin: Date
  isBlocked: boolean
  role: number
}
