import geoip from 'geoip-lite';
import OTPModel from '../models/OTPModel.js';
import sendEmailOTP from '../utils/sendEmailOTP.js';
import sendMobileOTP from '../utils/sendMobileOTP.js';

import users from '../Models/AuthModel.js'; // ⬅️ Add this import at the top if not present
import jwt from 'jsonwebtoken'; // ⬅️ Add this import if not already present

const SOUTH_INDIAN_STATES = ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana'];

function getClientIp(req) {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0];
  }
  return req.socket?.remoteAddress || req.ip;
}

export const sendOTP = async (req, res) => {
  try {
    const ip = getClientIp(req);
    console.log("Client IP:", ip); 

    const geo = geoip.lookup(ip);
    console.log("Geo info:", geo); 

    const state = geo?.region || '';
    console.log("Detected State:", state); 

    const identifier = req.body.identifier;
    console.log("Received Identifier:", identifier); 

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Identifier (email/phone) is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp); 

   
    if (/^\+?[1-9]\d{1,14}$/.test(identifier)) {
      // It's a valid phone number
      await sendMobileOTP(identifier, otp);
  } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      // It's a valid email
      await sendEmailOTP(identifier, otp);
  } else {
      return res.status(400).json({
          success: false,
          message: "Invalid identifier format. Must be a valid email or phone number starting with '+' and country code.",
      });
  }

    await OTPModel.create({ identifier, otp });
    console.log("OTP saved to DB");

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      region: state,
    });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Identifier and OTP are required' });
    }

    const valid = await OTPModel.findOne({ identifier, otp });

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    await OTPModel.deleteOne({ _id: valid._id });

    let user;

    if (/^\+?[1-9]\d{1,14}$/.test(identifier)) {
      user = await users.findOne({ phone: identifier });
      if (!user) user = await users.create({ phone: identifier });
    } else {
      user = await users.findOne({ email: identifier });
      if (!user) user = await users.create({ email: identifier });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      result: user,
      token: token  // Make sure this matches what frontend expects
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: error.message,
    });
  }
};
