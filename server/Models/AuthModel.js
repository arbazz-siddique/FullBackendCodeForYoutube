import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true, // allows multiple nulls
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: String,
  desc: String,
  password: String,
  isPremium: { type: Boolean, default: false },
  downloads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  downloadHistory: [{ type: String }],
  joinedon: {
    type: Date,
    default: Date.now(),
  },
  
});

export default mongoose.model("User", userSchema);
