import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      'Quá nhiều lần đăng nhập từ địa chỉ IP này, vui lòng thử lại sau 60 giây.',
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message)
  },
  standardHeaders: true,
  legacyHeaders: false,
})
