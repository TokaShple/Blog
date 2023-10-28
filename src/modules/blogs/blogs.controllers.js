import { where } from "sequelize";
import { blogSchema } from "../../../database/models/blog.model.js";
import { userSchema } from "../../../database/models/user.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import AppError from "../../utlis/services/AppError.js";

//         1.Add Blog
export const addBlog = catchAsyncError(async (req, res, next) => {
  try {
    const { title, description} = req.body;
    const userId = req.userId;
    //const images = req.files.images; 
    //console.log(images);
    const blog = await blogSchema.create({
      title,
      description,
      userId: userId,
      //images: images.map((image) => image.path),
    });
    await blog.save();
    if (blog) {
      res.status(201).json({ message: "BLOG CREATED.....", blog });
    } else {
      next(new AppError("CAN NOT ADD BLOG!!!!", 400));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ERROR!!!!", err });
  }
});

//         2.Get Blog
export const getBlog = catchAsyncError(async (req,res,next)=>{
  const  userId  = req.userId;
  const user = await userSchema.findByPk(userId);
  if (!user){
    next (new AppError("User Not Found!!!!!",400));
  }else{
    const blogs = await blogSchema.findAll();
    res.status(200).json({message:"Blogs",blogs});
  }
})

//         3.Update Blog
export const updateBlog = catchAsyncError (async (req,res,next)=>{
  const userId=req.userId;
  const {title,description} = req.body;
  const images = req.files.images;
  const {id} = req.params;
  const blogExist = await blogSchema.findByPk(id);
  !blogExist && next (new AppError ("BLOG NOT FOUND!!!",404));
  const blog = await blogSchema.update(
    {title,description,images: images.map((image) => image.path)},
    {where:{id}}
  );
  !blog && next (new AppError ("BLOG NOT SAVED!!!",400));
  blog && res.status(200).json({message:"BLOG SAVED.....",blog});
})

//         4.Delete Blog
export const deleteBlog = catchAsyncError (async (req,res,next)=>{
  const userId=req.userId;
  const {id} = req.params;
  const blogExist = await blogSchema.findByPk(id);
  !blogExist && next (new AppError ("BLOG NOT FOUND!!!",404));
  const blog = await blogSchema.destroy({where:{id}});
  !blog && next (new AppError ("BLOG NOT DELETED!!!",400));
  blog && res.status(200).json({message:"BLOG DELETED.....",blog});
})

//         5.ADD Blog Images
export const addBlogImages = catchAsyncError (async (req,res,next)=>{
  const userId = req.userId;
  const {id} = req.params;
  const images = req.files.images;
  const blogExist = await blogSchema.findByPk(id);
  if(!blogExist){
    return next (new AppError("BLOG DOESN'T EXIST!!!!",404));
  }else{
      const addImage = await blogSchema.update(
        {images: images.map((image) => image.path)},
        {where:{id}}
        );
      if(!addImage){
        return next (new AppError("Image / Images dosen't saved!!!!",400));
      }else{
        res.status(200).json({message:"Image Saved....",addImage});
      }
  }
})
