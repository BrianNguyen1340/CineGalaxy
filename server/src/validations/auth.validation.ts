import Joi from 'joi'

const register = Joi.object({
  email: Joi.string().required().trim().max(50).email(),
  password: Joi.string()
    .required()
    .trim()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,30}$/,
      ),
    ),
  name: Joi.string().required().trim().min(2).max(50),
})

const verifyOTPRegister = Joi.object({
  code: Joi.number().required(),
})

const gooleLogin = Joi.object({
  email: Joi.string().trim().required().email(),
  name: Joi.string().trim().required(),
  photoURL: Joi.string().trim().required(),
})

const login = Joi.object({
  email: Joi.string().required().trim().max(50).email(),
  password: Joi.string()
    .required()
    .trim()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,30}$/,
      ),
    ),
})

const forgotPassword = Joi.object({
  email: Joi.string().required().trim().max(50).email(),
})

const resetPassword = Joi.object({
  password: Joi.string()
    .required()
    .trim()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,30}$/,
      ),
    ),
})

export const authValidation = {
  register,
  verifyOTPRegister,
  login,
  forgotPassword,
  resetPassword,
  gooleLogin,
}
