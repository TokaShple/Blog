import jwt, { decode } from "jsonwebtoken";
import { userSchema } from "../../../database/models/user.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import AppError from "../../utlis/services/AppError.js";
import bcrypt, { compare } from "bcrypt";
import { sendEmail } from "../../utlis/services/sendEmail.js";
import { DATE, where } from "sequelize";

//              1-SIGN UP
const signup =catchAsyncError (async (req,res,next)=>{
  try{
    const {name,email,password,phone,age} = req.body;
    req.body.profilePicture=req.file.filename;
    const isFound = await userSchema.findOne({ where:{ email:req.body.email }});
    if(isFound){
      next(new AppError("USER ALREADY EXISTS!!!!!",409));
    }else{
      const user= await userSchema.create(req.body);
      await user.save();

      const token = jwt.sign({email:user.email,id:userId},process.env.TOKEN_SECRET_KEY_VERIFY);
      const link = `${req.protocol}://${req.headers.host}/user/Verify Email/${token}`;
      sendEmail(email,"Verify Your Email",`<a href = '${link}'> Verify Email </a>`);

      res.status(201).json({message:"User signed up successfully.....",user});
      }
    }catch(err){
      console.log(err);
      res.status(500).json({message:"ERROR!!!!!",err});
    }
})

//              2-SIGN IN
const signin=catchAsyncError(async(req,res,next)=>{
  try{
    let {email,password} = req.body;
    let isFound=await userSchema.findOne({where:{email}});
    console.log(isFound.password);
    if(!isFound) { 
      next (new AppError("WRONG EMAIL !!!",400)) 
    }else{
      let matched= await bcrypt.compare(password,isFound.password);
      if(!matched){
        next (new AppError("WRONG PASSWORD !!!",401));
      }else{
        let token=jwt.sign({
          name:isFound.name,
          userId:isFound.id,
          role:isFound.role,
          email:isFound.email,
          confirmed:isFound.confirmed
        }, process.env.SECRET_KEY, {expiresIn:"1m"});
        let userActive=await userSchema.update({active:true},{where:{email,active:false}});

        //check if the the token expired
        const decodedToken = jwt.verify(token,process.env.SECRET_KEY);
        let currentTime = Date.now() /  1000;
        if (decodedToken.exp < currentTime) {
          return res.status(401).json({ message: "Token expired" });
        }

        return res.status(200).json({message:"LOGIN SUCCESS...",token,userActive});
      }
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err})
  }
})

//          3-Verification
const verification=catchAsyncError(async(req,res,next)=>{
  try{
    let{token}=req.params;
    jwt.verify(token,process.env.TOKEN_SECRET_KEY_VERIFY,async(err,decoded)=>{
      if(err) return res.status(400).json({message:"INVALID!!!!!",err});
      let updated=await userSchema.update({confirmed:true},{where:{email:decoded.email,confirmed:false}});
      res.status(200).json({message:"CONFIRMED.....",updated});
    })
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err})
  }
})

//              4- ADD PROFILE PICTURE
const addProfilePicture=catchAsyncError(async(req,res,next)=>{
  try{
    req.body.profilePicture = req.file.filename;
    let user = await userSchema.findByPk(req.userId);
    if(!user){
      next(new AppError("User Not Found!!!!",404));
    }else{
      let image = await userSchema.update(
        {profilePicture:req.body.profilePicture},
        {where:{id:req.userId}}
        );
      if(image){
        res.status(200).json({message:"ADDED...",image});
      }else{
        next(new AppError("CAN NOT SAVE IMAGE!!!!",400));
      }
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!",err});
  }
})

//              5-UPDATE USER
const updateUser=catchAsyncError(async(req,res,next)=>{
  try{
    const userId = req.userId;
    const {name,email,phone,age,profilePicture} = req.body;
    const user = await userSchema.findByPk(userId);
    let updateUser;
    if(!user){
      next(new AppError("User Not Found!!",404));
    }else{
      updateUser=await userSchema.update({name:name,email:email,phone:phone,age:age,profilePicture:profilePicture},{ where: {id:userId} });
      if(user.email !== updateUser.email) { 
        //let confirmed = req.confirmed;
        updateUser=await userSchema.update({confirmed:false},{where:{id:userId,confirmed:true}});

        const token = jwt.sign({email:user.email,id:userId},process.env.TOKEN_SECRET_KEY_VERIFY);
        const link = `${req.protocol}://${req.headers.host}/user/updateEmail/${token}`;
        sendEmail(email,"Verify Your Email",`<a href = '${link}'> Udate Email </a>`);

        updateUser && res.status(200).json({message:"User Email Updated...",user:user.email});
        !updateUser && next(new AppError("User Email NOT UPDATED!!!!!",400));
       }else{
        updateUser && res.status(200).json({message:"user updated...",user});
        !updateUser && next(new AppError("User NOT UPDATED!!!!!",400));
       }
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!",err});
  }
})

//              6-Deactive USER
const deactiveAccount=catchAsyncError(async(req,res,next)=>{
  try{
    const userId = req.userId;
    const {password} = req.body;
    const user = await userSchema.findByPk(userId);
    if(!user) return next(new AppError("USER NOT FOUND!!!",400));
    const matchPassword = await compare(password,user.password) ;
    !matchPassword && next (new AppError("PASSWORD ISN'T CORRECT!!!!!",400)) ;
    const deactiveAccount = await userSchema.destroy({where:{id:userId}});
    deactiveAccount && res.status(200).json({message:"User deleted",user});
    !deactiveAccount && next(new AppError("CAN NOT DELETE USER!!!!!!",400));
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!",err});
  }
})

//              7-change Password
const changePassword=catchAsyncError(async(req,res,next)=>{
  try{
    const userId = req.userId;
    const {newPassword} = req.body;
    const user = await userSchema.findByPk(userId);
    const match = await bcrypt.compare(newPassword,user.password);
    if(match) return next(new AppError("Password Match Old password!!!",400));
    console.log("NEW PASSWORD: ",newPassword);
    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.Rounds));
    console.log("HASHED PASSWORD: ",hashedPassword);
    user.changePasswordAt= Date.now();
    const update =await userSchema.update({password:hashedPassword,
                                           changePasswordAt:user.changePasswordAt},
                                           {where:{id:userId}});
    !update && next (new AppError("CANNOT CHANGE PASSWORD!!!",400));
    update && res.status(200).json({message:"Password have been updated...",
                                      changePasswordAt:user.changePasswordAt,
                                      password:hashedPassword});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!",err});
  }
})

//              8-Forget Password
const forgetPassword=catchAsyncError(async(req,res,next)=>{
  try{
    
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!",err});
  }
})

//              9-REACTIVATE Account
const reactivateAccount=catchAsyncError(async(req,res,next)=>{
  try{
    
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!",err});
  }
})

//              10-Log Out
const logout=catchAsyncError(async(req,res,next)=>{
  try{
    
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!",err});
  }
})

export{ 
  signup,
  signin,
  verification ,
  addProfilePicture,
  updateUser,
  deactiveAccount,
  changePassword,
  forgetPassword,
  reactivateAccount,
  logout
};