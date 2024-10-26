import Joi from 'joi'

// *****************************************************************************

const handleCreate = Joi.object({
  number: Joi.number().required(),
  row: Joi.string().required().trim(),
  type: Joi.string().required().trim(),
  status: Joi.string().required().trim(),
  price: Joi.number().required(),
})

const handleUpdate = Joi.object({
  number: Joi.number().optional(),
  row: Joi.string().trim().optional(),
  type: Joi.string().trim().optional(),
  status: Joi.string().trim().optional(),
  price: Joi.number().optional(),
})

export const seatValidation = { handleCreate, handleUpdate }
