import Joi from 'joi'

const handleCreate = Joi.object({
  name: Joi.string().required().trim(),
  address: Joi.string().required().trim(),
  phone: Joi.string().required().trim(),
  email: Joi.string().required().trim(),
  cinemaComplex: Joi.string().required().trim(),
})

const handleUpdate = Joi.object({
  name: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  phone: Joi.string().trim().optional(),
  email: Joi.string().trim().optional(),
  cinemaComplex: Joi.string().trim().optional(),
})

export const cinemaValidation = {
  handleCreate,
  handleUpdate,
}
