import { CinemaComplexType } from './cinemaComplex.type'

export type CinemaType = {
  _id: string
  name: string
  address: string
  phone: string
  email: string
  cinemaComplex: CinemaComplexType
}
