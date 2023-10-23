
import nodemailer from "nodemailer";
import { html } from "./email-template.js";
import jwt from "jsonwebtoken";
/*
export const sendEmail =async (options) =>{
  let transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.EMAIL_VERIFY,
      pass:process.env.PASS_VERIFY
    }
  });

  let token=jwt.sign({email:options.email},process.env.TOKEN_SECRET_KEY_VERIFY);

  console.log(options.email)
  let info = await transporter.sendMail({
    from:process.env.EMAIL_VERIFY,
    to:options.email,
    subject:"THIS IS YOUR VEFICATION EMAIL",
    html:html(token)
  })
}
*/

export const sendEmail=async(email,subject,html)=>{
  let transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.EMAIL_VERIFY,
      pass:process.env.PASS_VERIFY
    },
  });
  let info=await transporter.sendMail({
    from:process.env.EMAIL_VERIFY,
    to:email,
    subject,
    html,
  });
  console.log("Done.....");
}