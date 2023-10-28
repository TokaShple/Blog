import { Router } from "express";
import * as blogController from "./blogs.controllers.js";
import { auth } from "../../utlis/middleware/auth.js";
import { uploadMixFile, uploadSingleFile } from "../../utlis/middleware/fileUploads.js";
import { validation } from "../../utlis/middleware/validation.js";
import { addBlogSchema, updateBlogSchema } from "./blogs.validator.js";

const blogRouter=Router();

blogRouter.route("/addBlog")
    .post(validation(addBlogSchema),uploadMixFile('blogs',[{name:"images"}]),auth,blogController.addBlog);
blogRouter.route("/getBlog")
    .get(auth,blogController.getBlog);
blogRouter.route("/addImage/:id")
    .put(uploadMixFile('blogs',[{name:"images"}]),auth,blogController.addBlogImages);
blogRouter.route("/updateBlog/:id")
    .post(uploadMixFile('blogs',[{name:"images"}]),validation(updateBlogSchema),auth,blogController.updateBlog);
blogRouter.route("/deleteBlog/:id")
    .delete(auth,blogController.deleteBlog);

export default blogRouter;
