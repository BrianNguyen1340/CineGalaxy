import Joi from 'joi'

const handleCreate = Joi.object({
  name: Joi.string().required().trim(),
  address: Joi.string().required().trim(),
  phone: Joi.string().required().trim(),
  email: Joi.string().required().trim(),
})

const handleUpdate = Joi.object({
  name: Joi.string().trim(),
  address: Joi.string().trim(),
  phone: Joi.string().trim(),
  email: Joi.string().trim(),
})

export const cinemaValidation = {
  handleCreate,
  handleUpdate,
}
