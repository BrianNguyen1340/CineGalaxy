import Joi from 'joi'

const handleCreate = Joi.object({
  date: Joi.date().required(),
  timeStart: Joi.string().required(),
  timeEnd: Joi.string().required(),
  movie: Joi.string().required().trim(),
  room: Joi.string().required().trim(),
  cinema: Joi.string().required().trim(),
  cinemaComplex: Joi.string().required().trim(),
})

const handleUpdate = Joi.object({
  date: Joi.date().optional(),
  timeStart: Joi.string().optional(),
  timeEnd: Joi.string().optional(),
  movie: Joi.string().trim().optional(),
  room: Joi.string().trim().optional(),
  cinema: Joi.string().trim().optional(),
  cinemaComplex: Joi.string().trim().optional(),
})

export const showtimeValidation = {
  handleCreate,
  handleUpdate,
}
