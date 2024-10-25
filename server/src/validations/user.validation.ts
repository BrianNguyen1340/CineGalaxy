import Joi from 'joi'

// *****************************************************************************

const updateProfile = Joi.object({
  email: Joi.string().email().trim().max(50).optional(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,30}$/,
      ),
    )
    .optional(),
  name: Joi.string().trim().min(2).max(50).optional(),
  dateOfBirth: {
    day: Joi.number().optional(),
    month: Joi.number().optional(),
    year: Joi.number().optional(),
  },
  photo: Joi.string().trim().optional(),
  gender: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  photoUrl: Joi.string().trim().optional(),
})

const userValidation = {
  updateProfile,
}

export default userValidation
