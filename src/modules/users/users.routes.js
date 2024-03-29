import { Router } from "express";
import * as userController from "./users.controllers.js"
import { auth } from "../../utlis/middleware/auth.js";
import { validation } from "../../utlis/middleware/validation.js";
import { signinschema, signupschema, updateUserSchema } from "./users.validator.js";
import { uploadSingleFile } from "../../utlis/middleware/fileUploads.js";
const userRouter=Router();

userRouter.route("/signup")
  .post(validation(signupschema), userController.signup);
  
userRouter.route("/signin")
.post(validation(signinschema),userController.signin);

userRouter.route("/verify/:token")
.get(userController.verification);

userRouter.route("/addProfilePicture")
.put(uploadSingleFile('userProfilePicture','profilePicture'),auth,userController.addProfilePicture);

userRouter.route("/updateUser")
.put(validation(updateUserSchema),auth,userController.updateUser);

userRouter.route("/deactiveAccount")
.patch(auth,userController.deleteAccount);

userRouter.route("/changePassword")
.patch(auth,userController.changePassword);

userRouter.route("/forgetPassword")
.patch(userController.forgetPassword);

userRouter.route("/reactivateAccount")
.patch(userController.reactivateAccount);

userRouter.route("/logout")
.get(auth,userController.logout);

userRouter.route("/allUsers")
.get(userController.getUser);

userRouter.route("/deactiveAt")
.patch(auth,userController.deactiveAccount);

export default userRouter;