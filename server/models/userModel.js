import {Schema,model} from "mongoose"
const userSchema = new Schema(
    {
        userName: { type: String, required: true ,unique:true},
        firstName: { type:String},
        lastName :{type:String},
        email:{type:String,required:true , unique:true},
        password:{type:String},
        isActive:{type:Boolean , default:true},
        isFirstTimeLogin :{type:Boolean , default:true}
},{
    timestamps:true
})

const UserModel = model("User",userSchema)
export default UserModel;