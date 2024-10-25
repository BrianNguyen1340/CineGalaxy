import Joi from 'joi'

// *****************************************************************************

const handleCreate = Joi.object({
  name: Joi.string().required().trim(),
  opacity: Joi.number().required(),
  status: Joi.string().required().trim(),
  screen: Joi.string().required().trim(),
  cinema: Joi.string().required().trim(),
})

const handleUpdate = Joi.object({
  name: Joi.string().trim().optional(),
  opacity: Joi.number().optional(),
  status: Joi.string().trim().optional(),
  screen: Joi.string().trim().optional(),
  cinema: Joi.string().trim().optional(),
})

export const roomValidation = { handleCreate, handleUpdate }
