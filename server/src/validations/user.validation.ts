import Joi from 'joi'

const updateProfile = Joi.object({
    email: Joi.string().email().trim().max(50),
    password: Joi.string()
        .trim()
        .min(8)
        .max(30)
        .pattern(
            new RegExp(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,30}$/,
            ),
        ),
    name: Joi.string().trim().min(2).max(50),
    dateOfBirth: {
        day: Joi.number(),
        month: Joi.number(),
        year: Joi.number(),
    },
    photo: Joi.string().trim(),
    gender: Joi.string().trim(),
    address: Joi.string().trim(),
    photoUrl: Joi.string().trim(),
})

const userValidation = {
    updateProfile,
}

export default userValidation
