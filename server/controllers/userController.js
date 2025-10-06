import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOtp } from "../utils/otpGenerate.js";
import { sendEmail } from "../utils/mailer.js";
import moment from "moment";
import { response } from "express";

const secretKey = process.env.JWT_SECRET_KEY;

export const createUser = async(req, res)=>{
    const {userName,password,confirmPassword ,email} = req.body
    const payload = {
        userName:userName,
        email:email
    }
    if(!userName || !password || !email || !confirmPassword){
        return res.json({success:false , message:"Field required !"});
    }
    if(password !== confirmPassword){
        return res.json({success:false , message:"Password must be same!"});
    }
    const existingUserName = await UserModel.findOne({userName:userName})
    if(existingUserName){
        console.log("existingUserName")
        return res.json({success:false ,message:"User name already existed!"})
    }
    if(password ===confirmPassword){
        payload.password = await bcrypt.hash(password, 10);
    }

    const dbresponse = await UserModel(payload).save()

    const token = jwt.sign(
        {
            _id:dbresponse._id,
            userName:dbresponse.userName,

        },secretKey,{
            expiresIn:"1d"
        }
    )

    res.json({success:true , message:"user created!" ,token})
}

export const preSignupUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Password validation
  if (password !== confirmPassword) {
    return res.json({ success: false, message: "Password is not correct!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({ success: false, message: "Email is not valid!" });
  }

  // Generate OTP
  const otp = await generateOtp();

  // Construct email payload
    const emailPayload = {
        toEmail: email,
        subject: "Your KI Chat Bot OTP Code",
        text: `Hello,

        Thank you for signing up for KI Chat Bot!

        Your One-Time Password (OTP) is: ${otp}

        Please enter this code within the next 10 minutes to complete your verification.

        If you didn’t request this, please ignore this email.

        – The KI Chat Bot Team
        `,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #4CAF50;">Welcome to KI Chat Bot 🎉</h2>
            <p>Thank you for signing up! Please use the following One-Time Password (OTP) to complete your verification:</p>
            <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 22px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border: 1px solid #ddd; border-radius: 6px; letter-spacing: 2px;">
                ${otp}
            </span>
            </div>
            <p>This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>
            <p>If you didn’t request this, you can safely ignore this email.</p>
            <br/>
            <p style="color: #555;">Best regards,<br/>The KI Chat Bot Team</p>
        </div>
        `
    };


  // Send email and handle errors
  try {
    const payload = {
        requestOtp: {
            otp: otp,
            time: moment().format()
        },
        email: email,
        password: hashedPassword
    };

    const response = await UserModel(payload).save()

    const emailSent = await sendEmail(emailPayload);
    if (!emailSent) {
      return res.json({ success: false, message: "Failed to send OTP email." });
    }
    // Success response
    res.json({ success: true, message: "User created!", data: response });
  } catch (error) {
    res.json({ success: false, message: "Server error.", error: error.toString() });
  }
};

export const userSignup = async(req, res)=>{
    const{userId ,otp} = req.body;
    if(!userId || !otp){
        res.json({success:false,message:"values required!", data:{}})
    }
    const userData = await UserModel.findById(userId);

    if (!userData) {
    return res.json({ success: false, message: "User not found!" });
    }

    if (!userData.requestOtp || userData.requestOtp.length === 0) {
    return res.json({ success: false, message: "No OTP found!" });
    }

    if (userData.requestOtp[0].otp !== otp) {
    return res.json({ success: false, message: "OTP incorrect!" });
    }

    const otpTime = moment(userData.requestOtp[0].time);
    const now = moment();

    console.log("now.diff(otpTime, 'minutes'):",now.diff(otpTime, 'minutes'))
    if (now.diff(otpTime, 'minutes') > 10) {
    return res.json({ success: false, message: "OTP Expired!" });
    }
    const response = await UserModel.findByIdAndUpdate(
    userId,
    { requestOtp: [{ otp: "", time: new Date() }] },
    { new: true }
    );

    res.json({success:true , message:"Signup success!",data:response})

}

export const resendOtp = async(req, res)=>{
    const{userId} = req.body
    
}
