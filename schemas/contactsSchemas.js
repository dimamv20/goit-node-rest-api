import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" is required`,
    "string.base": `"name" must be a string`,
  }),
  email: Joi.string().email().required().messages({
    "any.required": `"email" is required`,
    "string.email": `"email" must be a valid email`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" is required`,
    "string.base": `"phone" must be a string`,
  }),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": `"name" must be a string`,
  }),
  email: Joi.string().email().messages({
    "string.email": `"email" must be a valid email`,
  }),
  phone: Joi.string().messages({
    "string.base": `"phone" must be a string`,
  }),
  favorite: Joi.boolean().messages({
    "boolean.base": `"favorite" must be a boolean`,
  }),
}).min(1).messages({
  "object.min": `Body must have at least one field`,
});

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `"favorite" is required`,
    "boolean.base": `"favorite" must be a boolean`,
  }),
});
