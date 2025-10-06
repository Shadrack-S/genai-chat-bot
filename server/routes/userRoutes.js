import express from "express";
import {preSignupUser, userSignup } from "../controllers/userController.js";

const userRouter = express.Router()

userRouter.post('/preSignup',preSignupUser)
userRouter.post('/signup',userSignup)

export default userRouter