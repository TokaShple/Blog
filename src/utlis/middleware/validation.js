import Joi from "joi";
/*
export const validation =(schema)=>{
  return(req,res,next)=>{
    let inputes = {...req.body, ...req.params, ...req.query};
    let {error}=schema.validate(inputes,{abortEarly:false});
    if(error){
      let errors = error.details.map((details)=>details.message);
      res.status(400).json({message:"ERROR IN VALIDATION!!!!!",error});
    }else{
      next();
    }
  }
}
*/
export const validation = (schema)=>{
  return (req,res,next)=>{
    let inputs={...req.body,...req.params,...req.query};
    let {error}=schema.validate(inputs,{abortEarly:false});
    if(error){
      let errors=error.details.map((detail)=>detail.message);
      res.status(400).json(errors);
    }else{
      next();
    }
  }
}