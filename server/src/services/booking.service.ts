import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import { BookingType, bookingModel } from '~/schemas/booking.schema'
import { ProductType, productModel } from '~/schemas/product.schema'
import { SeatType, seatModel } from '~/schemas/seat.schema'
import { showtimeModel } from '~/schemas/showtime.schema'
import { userModel } from '~/schemas/user.schema'

const handleCreate = async (
  user: Types.ObjectId,
  showtime: Types.ObjectId,
  seats: Types.ObjectId[],
  products: Types.ObjectId[],
  paymentMethod: string,
): Promise<{
  success: boolean
  message: string
  statusCode: number
  data?: Partial<BookingType>
}> => {
  try {
    const checkUser = await userModel.findById(user)
    if (!checkUser) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      }
    }
    const checkShowtime = await showtimeModel.findById(showtime)
    if (!checkShowtime) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Suất chiếu không tồn tại!',
      }
    }

    const seatList = await seatModel.find({ _id: { $in: seats } })
    if (seatList.length !== seats.length) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Một hoặc nhiều ghế không hợp lệ!',
      }
    }

    const productList = await productModel.find({ _id: { $in: products } })
    if (productList.length !== products.length) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Một hoặc nhiều sản phẩm không hợp lệ!',
      }
    }

    const totalSeatsPrice = seatList.reduce(
      (sum, seat: SeatType) => sum + seat.price,
      0,
    )
    const totalProductsPrice = productList.reduce(
      (sum, product: ProductType) => sum + product.price,
      0,
    )
    const totalAmount = totalSeatsPrice + totalProductsPrice
    const taxPrice = totalAmount * 0.1

    const request = await bookingModel.create({
      user,
      showtime,
      seats,
      products,
      totalAmount,
      taxPrice,
      isPaid: false,
      paymentMethod,
      bookingDate: new Date(),
    })

    if (!request) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Đặt vé thất bại',
      }
    }

    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Đặt vé thành công!',
      data: request,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Lỗi hệ thống: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    }
    return {
      success: false,
      message: 'Đã xảy ra lỗi không xác định!',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  }
}

export const bookingService = {
  handleCreate,
}
