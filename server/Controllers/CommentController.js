import axios from "axios";
import CommentModel from "../Models/CommentModel.js";

import mongoose from "mongoose";


// export const postcomment = async (req, res) => {
//     try {
//         const { commentbody, userId, videoId, language, city } = req.body;

//         // ✅ Validate special characters (only allow letters, numbers, spaces, .,!?)
//         if (/[^a-zA-Z0-9\s.,!?]/.test(commentbody)) {
//             return res.status(400).json({ message: "Special characters are not allowed!" });
//         }

//         const newComment = new CommentModel({
//             commentbody,
//             userid: userId,
//             videoid: videoId,
//             language,
//             city,
//             usercommented
//         });

//         const savedComment = await newComment.save();
//         res.status(201).json({ message: "Posted the comment", comment: savedComment });
//     } catch (error) {
//         res.status(500).json({ message: "Error adding comment", error: error.message });
//     }
// };

export const postcomment = async(req,res)=>{
    const commentdata = req.body;
    const postcomment = new CommentModel(commentdata)
    try {
        await postcomment.save()
        res.status(201).json({ message: "Posted the comment" });

    } catch (error) {
        res.status(400).json({message: error.message})
        return
    }
}

export const translateComment = async (req, res) => {
    try {
        const { commentId, targetLanguage } = req.body;

        const comment = await CommentModel.findById(commentId);

        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Use Google Translate API
        const response = await axios.post(
            `https://translation.googleapis.com/language/translate/v2`,
            {},
            {
                params: {
                    q: comment.commentbody, // use your schema's comment text field
                    target: targetLanguage,
                    key: process.env.GOOGLE_TRANSLATE_API_KEY,
                },
            }
        );

        res.status(200).json({ translatedText: response.data.data.translations[0].translatedText });
    } catch (error) {
        res.status(500).json({ message: "Error translating comment", error: error.message });
    }
};




export const getcomment = async(req,res)=>{
    try {
        const commentlist = await CommentModel.find()
        res.status(200).send(commentlist)
    } catch (error) {
        res.status(400).json({message: error.message})
        return
    }
}

export const deletecomment = async(req,res)=>{
    const {id:_id}= req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)){
            return res.status(400).send("Comment unavailable..")
    }

    try {
         await CommentModel.findByIdAndDelete(_id);
         res.status(200).json({message:"Deleted Comment"})
    } catch (error) {
        res.status(400).json({message: error.message})
        return
    }
}

export const editcomment = async(req,res)=>{
    const {id:_id}= req.params;
    const {commentbody} = req.body
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send("Comment unavailable..")
}
    try {
        const updatecomment = await CommentModel.findByIdAndUpdate(
            _id,
            {$set:{"commentbody":commentbody}}
        )
        res.status(200).json(updatecomment)
    } catch (error) {
        res.status(400).json({message: error.message})
        return
    }
}

export const likecomment = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; // you must get this from auth middleware
  
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid comment ID" });
  
    try {
      const comment = await CommentModel.findById(id);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      if (comment.likedBy.includes(userId)) {
        return res.status(400).json({ message: "Already liked by user" });
      }
  
      // Remove user from dislikes if they disliked before
      comment.dislikedBy = comment.dislikedBy.filter(id => id.toString() !== userId);
      comment.likes += 1;
      comment.likedBy.push(userId);
  
      await comment.save();
      res.status(200).json({ likes: comment.likes });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const dislikecomment = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid comment ID" });
  
    try {
      const comment = await CommentModel.findById(id);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      comment.dislikes += 1;
  
      // Auto-delete if dislikes reach 2
      if (comment.dislikes >= 2) {
        await comment.deleteOne();
        return res.status(200).json({ message: "Comment auto-deleted due to dislikes" });
      }
  
      await comment.save();
      res.status(200).json({ dislikes: comment.dislikes });
    } catch (error) {
      console.error("Dislike Error:", error); // 🔥 Add this line
      res.status(500).json({ message: error.message });
    }
  };
  
  
