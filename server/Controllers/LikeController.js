import videofile from "../Models/VideofileModel.js";
import mongoose from "mongoose";

export const likevideocontroller = async (req, res) => {
    const { id } = req.params;  // Ensure you extract 'id', not '_id'
    const { Like } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Video Unavailable.." });
    }

    try {
        const updatedLike = await videofile.findByIdAndUpdate(
            id, 
            { $set: { Like } }, // If you want to replace Like
            { new: true } // Return updated document
        );

        res.status(200).json(updatedLike);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
