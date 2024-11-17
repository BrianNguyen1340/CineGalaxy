import Joi from 'joi'

const handleCreate = Joi.object({
  code: Joi.string().trim().required(),
  discountPercentage: Joi.number().required(),
  expirationDate: Joi.date().required(),
  isActive: Joi.boolean().required(),
  user: Joi.string().required().trim(),
})

const handleUpdate = Joi.object({
  code: Joi.string().trim().optional(),
  discountPercentage: Joi.number().optional(),
  expirationDate: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
  user: Joi.string().trim().optional(),
})

export const couponValidation = {
  handleCreate,
  handleUpdate,
}
