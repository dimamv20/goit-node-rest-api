import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required().messages ({
        'any.required': `"name" is required`,
        'string.base': `"name" cannot be a string 
        `
    }),
    email: Joi.string().email().required().messages ({
        'any.required': `"email" is required`,
        'string.email': `"email" must be a valid email`
    }),
    phone: Joi.string().required().messages ({
        'any.required': `"phone" is required`,
        'string.base': `"phone" cannot be a string`
    })
});
export const updateContactSchema = Joi.object({
    name: Joi.string().messages ({
        'string.base': `"name" cannot be a string`
    }),
    email: Joi.string().email().messages ({
        'string.email': `"email" must be a valid email`
    }),
    phone: Joi.string().messages ({
        'string.base': `"phone" cannot be a string`
    }).min(1).messages ({
        'any.required': `At least one field must be provided for update`
    })
});