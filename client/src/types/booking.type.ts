export type BookingType = {
  readonly _id: string
  user: string
  showtime: string
  bookingDate: Date
  totalAmount: number
  seats: string[]
  products: string[]
  isPaid: boolean
  paymentMethod: string
  taxPrice: number
}
