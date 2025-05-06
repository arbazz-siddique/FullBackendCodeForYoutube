import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  identifier: String,
  otp:String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // OTP expires in 5 minutes
  },
}, { timestamps: true });

const OTPModel = mongoose.model("OTP", OTPSchema);
export default OTPModel;
