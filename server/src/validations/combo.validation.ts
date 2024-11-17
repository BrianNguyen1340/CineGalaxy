import Joi from 'joi'

const handleCreate = Joi.object({
  name: Joi.string().required().trim(),
  expiry: Joi.number().required(),
  products: Joi.array().required(),
  image: Joi.string().required().trim(),
})

const handleUpdate = Joi.object({
  name: Joi.string().trim().optional(),
  expiry: Joi.number().optional(),
  products: Joi.array().optional(),
  image: Joi.string().optional().trim(),
})

export const comboValidation = {
  handleCreate,
  handleUpdate,
}
