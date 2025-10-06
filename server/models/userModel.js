import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isActive: { type: Boolean, default: true },
    requestOtp: [
      {
        otp: { type: String },
        time: { type: Date }
      },
      { _id: false }
    ],
    isFirstTimeLogin: { type: Boolean, default: true },
    is2FAEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: true
  }
);

const UserModel = model("User", userSchema);
export default UserModel;
