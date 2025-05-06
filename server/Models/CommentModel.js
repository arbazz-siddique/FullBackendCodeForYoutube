import mongoose from "mongoose";

const commentschema = mongoose.Schema({
  videoid: String,
  userid: String,
  commentbody: String,
  usercommented: String,
  city: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  commentedon: { type: Date, default: Date.now },
});

export default mongoose.model("Comments", commentschema);
