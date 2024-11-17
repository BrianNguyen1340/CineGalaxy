import Joi from 'joi'

const createUserByAdmin = Joi.object({
  email: Joi.string().email().trim().max(50).required(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,30}$/,
      ),
    )
    .required(),
  name: Joi.string().trim().min(2).max(50).required(),
  role: Joi.number().required(),
})

const updateProfile = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  email: Joi.string().trim().max(50).optional(),
  phone: Joi.string().trim().optional(),
  gender: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  photoURL: Joi.string().trim().optional(),
})

export const userValidation = {
  createUserByAdmin,
  updateProfile,
}

