import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'
import { ProductType, productModel } from '~/schemas/product.schema'
import { userModel } from '~/schemas/user.schema'

const addToCart = async (
  productId: Types.ObjectId,
  userId: Types.ObjectId,
): Promise<{
  success: boolean
  statusCode: number
  message: string
  data?: {
    product: Types.ObjectId
    quantity: number
  }[]
}> => {
  try {
    const user = await userModel.findById(userId)
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Người dùng không tồn tại!',
      }
    }

    const productIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId.toString(),
    )
    if (productIndex > -1) {
      user.cart[productIndex].quantity += 1
    } else {
      user.cart.push({ product: productId, quantity: 1 })
    }

    await user.save()

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy thông tin giỏ hàng thành công!',
      data: user.cart,
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

const getCartProducts = async (
  userId: Types.ObjectId,
): Promise<{
  success: boolean
  statusCode: number
  message: string
  data?: {
    product: Types.ObjectId
    quantity: number
  }[]
}> => {
  try {
    const user = await userModel.findById(userId)
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Người dùng không tồn tại!',
      }
    }

    if (user.cart.length === 0) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Giỏ hàng trống!',
      }
    }

    const products = await productModel.find({
      _id: {
        $in: user.cart.map((item) => item.product),
      },
    })

    const cart = products.map((product: ProductType) => {
      const item = user.cart.find(
        (cartItem) => cartItem.product.toString() === product._id.toString(),
      )
      if (item) {
        return {
          product: product._id,
          quantity: item.quantity,
        }
      }
    })

    const filteredCart = cart.filter(Boolean) as {
      product: Types.ObjectId
      quantity: number
    }[]

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Lấy thông tin giỏ hàng thành công!',
      data: filteredCart,
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

const removeAllFromCart = async (
  productId: Types.ObjectId,
  userId: Types.ObjectId,
): Promise<{
  success: boolean
  statusCode: number
  message: string
  data?: {
    product: Types.ObjectId
    quantity: number
  }[]
}> => {
  try {
    const user = await userModel.findById(userId)
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Người dùng không tồn tại!',
      }
    }

    if (productId) {
      const product = await productModel.findById(productId)
      if (!product) {
        return {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Sản phẩm không tồn tại!',
        }
      }

      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId.toString(),
      )
    } else {
      user.cart = []
    }

    await user.save()

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: productId
        ? 'Xóa sản phẩm khỏi giỏ hàng thành công!'
        : 'Xóa toàn bộ sản phẩm khỏi giỏ hàng thành công!',
      data: user.cart,
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

const updateQuantity = async (
  productId: Types.ObjectId,
  userId: Types.ObjectId,
  quantity: number,
): Promise<{
  success: boolean
  statusCode: number
  message: string
  data?: {
    product: Types.ObjectId
    quantity: number
  }[]
}> => {
  try {
    const product = await productModel.findById(productId)
    if (!product) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Sản phẩm không tồn tại!',
      }
    }

    const user = await userModel.findById(userId)
    if (!user) {
      return {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Người dùng không tồn tại!',
      }
    }

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId.toString(),
    )
    if (!cartItem) {
      return {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Sản phẩm không tồn tại trong giỏ hàng!',
      }
    }

    if (quantity === 0) {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId.toString(),
      )

      await user.save()

      return {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Đã xóa sản phẩm khỏi giỏ hàng!',
        data: user.cart,
      }
    }

    cartItem.quantity = quantity

    await user.save()

    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cập nhật số lượng sản phẩm thành công!',
      data: user.cart,
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

export const cartService = {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
}
