import Joi from 'joi'

const handleCreate = Joi.object({
  name: Joi.string().required().trim(),
})

const handleUpdate = Joi.object({
  name: Joi.string().trim().optional(),
})

export const cinemaComplexValidation = {
  handleCreate,
  handleUpdate,
}
