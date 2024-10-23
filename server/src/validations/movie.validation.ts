import Joi from 'joi'

const handleCreate = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  director: Joi.string().required().trim(),
  releaseDate: Joi.date().required(),
  duration: Joi.number().required(),
  trailer: Joi.string().required().trim(),
  movieRating: Joi.string().required().trim,
  subtitle: Joi.string().required().trim,
  movieFormat: Joi.string().required().trim,
  genreId: Joi.string().required().trim(),
})

const handleUpdate = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  director: Joi.string().trim(),
  releaseDate: Joi.date(),
  duration: Joi.number(),
  poster: Joi.string().trim(),
  trailer: Joi.string().trim(),
  movieRating: Joi.string().trim,
  subtitle: Joi.string().trim,
  movieFormat: Joi.string().trim,
  genreId: Joi.string().trim(),
})

export const movieValidation = {
  handleCreate,
  handleUpdate,
}
