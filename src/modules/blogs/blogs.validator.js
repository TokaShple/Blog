import Joi from "joi";

//1.ADD BLOG SCHEMA
export const addBlogSchema=Joi.object({
  title:Joi.string().min(3).max(1000).required(),
  description:Joi.string().min(3).max(5000).required(),
  images:Joi.string()
})

//3.UPDATE BLOG SCHEMA
export const updateBlogSchema=Joi.object({
  title:Joi.string().min(3).max(1000).required(),
  description:Joi.string().min(3).max(5000).required(),
  images:Joi.string()
})