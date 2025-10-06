import express from "express";
import {preSignupUser, userSignup } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authenticate.js";

const userRouter = express.Router()

userRouter.post('/preSignup',preSignupUser)
userRouter.post('/signup',userSignup)
userRouter.get('/refreshToken',authMiddleware)

export default userRouter