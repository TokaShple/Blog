import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv"; 
import { connection } from "./database/connection.js";
import userRouter from "./src/modules/users/users.routes.js";
import globalError from "./src/utlis/middleware/globalErrorHandle.js"; 
import AppError from "./src/utlis/services/AppError.js";
import blogRouter from "./src/modules/blogs/blogs.routes.js";
dotenv.config();
const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1/user",userRouter);
app.use("/api/v1/blog",blogRouter);
const port=3000;
app.use(express.static("uploads"));
app.use(express.json());
app.use(globalError); 
app.use("*",(req,res,next)=>{
  next(new AppError(`Invalid URL ${req.originalUrl}`),404);
});
app.use(express.urlencoded({extended:true})); // to allow use Form data
app.listen(port,()=>{
  console.log("SERVER IS RUNNING.....");
});
