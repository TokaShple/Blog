import jwt from "jsonwebtoken";
import AppError from "../services/AppError.js";
import catchAsyncError from "./catchAsyncError.js";
import { userSchema } from "../../../database/models/user.model.js";
/*
export const auth =catchAsyncError(async(req,res,next)=>{
  let authorization=req.headers["authorization"];
  if(!authorization || (authorization && authorization.startsWith("Bearer")==false) ){
    next(new AppError("TOKEN NOT PROVIDED!!!!!",400));
  }else{
    let token=authorization.split(" ")[1];
    await jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
      if(err){
        next(new AppError("INVALID TOKEN!!!!!",400));
      }else{
        req.userId=decoded.id;
        console.log(req.userId)
        next();
      }
    })
  }
})
*/

export const auth=catchAsyncError(async(req,res,next)=>{
  try{
    let{token}=req.headers;
    if(!token)return next(new  AppError("PLEASE PROVIDE TOKEN!!",401));
    let decoded=await jwt.verify(token,process.env.SECRET_KEY);
    let user=await userSchema.findByPk(decoded.userId);
    if (!user) return next(new AppError("Invalid user", 401));
    /*if (user.changePasswordAt) {
      let changePasswordTime = parseInt(user.changePasswordAt.getTime() / 1000);
      console.log(changePasswordTime, "---------->", decoded.iat);
    }*/
    if(!user)return next(new AppError("invalid user ",401));
    req.userId=user.id;
    next();
  }catch(err){
    console.log(err);
    res.status(401).json({message:"ERROR!!!!",err});
  }
})
