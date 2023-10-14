import Joi from "joi";

//1.SIGN UP SCHEMA
export const signupschema=Joi.object({
  name:Joi.string().min(3).max(1000).required(),
  email:Joi.string().pattern(RegExp("[A-Za-z]{3,}@[A-Za-z]{3,8}\.[com|net]")).required(),
  password:Joi.string().pattern(RegExp("[A-Za-z0-9!@#$%^&*()]{8}")).required(),
  phone:Joi.number().min(11).required(),
  age:Joi.date().required(),
  profilePicture:Joi.string()
})
//2.SIGN IN SCHEMA
export const signinschema=Joi.object({
  email:Joi.string().pattern(RegExp("[A-Za-z]{3,}@[A-Za-z]{3,8}\.[com|net]")).required(),
  password:Joi.string().pattern(RegExp("[A-Za-z0-9!@#$%^&*()]{8}")).required()
})
//3.UPDATE SCHEMA
export const updateUserSchema=Joi.object({
  name:Joi.string().min(3).max(1000),
  email:Joi.string().pattern(RegExp("[A-Za-z]{3,}@[A-Za-z]{3,8}\.[com|net]")),
  password:Joi.string().pattern(RegExp("[A-Za-z0-9!@#$%^&*()]{8}")),
  phone:Joi.number().min(11),
  age:Joi.date(),
  profilePicture:Joi.string(),
  role:Joi.string()
})