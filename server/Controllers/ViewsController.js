import videofile from "../Models/VideofileModel.js";
import mongoose from "mongoose";

export const viewscontroller = async (req, res) => {
    const { id: _id } = req.params;

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "Invalid Video ID" });
    }

    try {
        // Increment views in a single query
        const updatedVideo = await videofile.findByIdAndUpdate(
            _id,
            { $inc: { views: 1 } }, // Increase views by 1
            { new: true } // Return updated document
        );

        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json(updatedVideo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
