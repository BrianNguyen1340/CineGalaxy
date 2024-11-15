import Joi from 'joi'

const handleCreate = Joi.object({
  name: Joi.string().required().trim(),
  category: Joi.string().required().trim(),
  image: Joi.string().required().trim(),
  price: Joi.number().required(),
  size: Joi.string().required().trim(),
})

const handleUpdate = Joi.object({
  name: Joi.string().trim().optional(),
  category: Joi.string().optional().trim(),
  image: Joi.string().optional().trim(),
  price: Joi.number().optional(),
  size: Joi.string().optional().trim(),
})

export const productValidation = {
  handleCreate,
  handleUpdate,
}
