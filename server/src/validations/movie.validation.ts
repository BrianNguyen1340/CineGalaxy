import Joi from 'joi'

// *****************************************************************************

const handleCreate = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  director: Joi.string().required().trim(),
  releaseDate: Joi.date().required(),
  duration: Joi.number().required(),
  poster: Joi.string().required().trim(),
  trailer: Joi.string().required().trim(),
  movieRating: Joi.string().required().trim(),
  subtitle: Joi.string().required().trim(),
  movieFormat: Joi.string()
    .valid('Thuyết minh', 'Phụ đề', 'Lồng tiếng')
    .required()
    .trim()
    .valid('2D', '3D'),
  genres: Joi.array().required(),
})

const handleUpdate = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  director: Joi.string().trim().optional(),
  releaseDate: Joi.date().optional(),
  duration: Joi.number().optional(),
  poster: Joi.string().trim().optional(),
  trailer: Joi.string().trim().optional(),
  movieRating: Joi.string().trim().optional(),
  subtitle: Joi.string()
    .valid('Thuyết minh', 'Phụ đề', 'Lồng tiếng')
    .trim()
    .optional(),
  movieFormat: Joi.string().trim().valid('2D', '3D').optional(),
  genres: Joi.array().optional(),
})

export const movieValidation = {
  handleCreate,
  handleUpdate,
}
