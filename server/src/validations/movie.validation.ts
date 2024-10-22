import Joi from 'joi'

const handleCreate = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  director: Joi.string().required().trim(),
  releaseDate: Joi.date().required(),
  age: Joi.number().required(),
  duration: Joi.date().required(),
  poster: Joi.string().required().trim(),
  trailer: Joi.string().required().trim(),
  genreId: Joi.string().required().trim(),
})

const handleUpdate = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  director: Joi.string().trim(),
  releaseDate: Joi.date(),
  age: Joi.number(),
  duration: Joi.date(),
  poster: Joi.string().trim(),
  trailer: Joi.string().trim(),
  genreId: Joi.string().trim(),
})

export const movieValidation = {
  handleCreate,
  handleUpdate,
}
