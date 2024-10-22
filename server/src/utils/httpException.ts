export class HttpException extends Error {
  status: number
  message: string

  constructor(
    status: number, // Đây là mã trạng thái HTTP mà bạn muốn trả về khi có lỗi.
    message: string, // Thông điệp mô tả lỗi, được truyền vào
  ) {
    super(message)
    this.status = status
    this.message = message
  }
}
