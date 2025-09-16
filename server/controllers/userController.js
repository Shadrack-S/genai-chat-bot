import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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