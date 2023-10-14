import { Router } from "express";
import * as userController from "./users.controllers.js"
import { auth } from "../../utlis/middleware/auth.js";
import { validation } from "../../utlis/middleware/validation.js";
import { signinschema, signupschema, updateUserSchema } from "./users.validator.js";
import { uploadSingleFile } from "../../utlis/middleware/fileUploads.js";
const userRouter=Router();

userRouter.route("/signup")
.post(uploadSingleFile('userProfilePicture','profilePicture'),validation(signupschema),userController.signup);

userRouter.route("/signin")
.post(validation(signinschema),userController.signin);

userRouter.route("/verify/:token")
.get(userController.verification);

userRouter.route("/addProfilePicture")
.put(uploadSingleFile('userProfilePicture','profilePicture'),auth,userController.addProfilePicture);

userRouter.route("/updateUser")
.put(validation(updateUserSchema),auth,userController.updateUser);

userRouter.route("/deleteUser")
.delete(auth,userController.deleteUser);

userRouter.route("/changePassword")
.patch(userController.changePassword);

userRouter.route("/forgetPassword")
.patch(userController.forgetPassword);

userRouter.route("/deactivateUser")
.patch(userController.deactivateUser);

userRouter.route("/logout")
.put(userController.logout);

export default userRouter;