
const Joi = require('joi');

const validationSchema = Joi.object({
    admissionNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
});

module.exports = validationSchema;