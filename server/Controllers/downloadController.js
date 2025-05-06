
import User from "../Models/AuthModel.js";
import video from "../Models/VideofileModel.js"

import fs from "fs";
import path from "path";

export const downloadVideo = async (req, res) => {
    try {
        const userId = req.user.id; // Authenticated user
        const { videoId } = req.params;

        // Find user in the database
        const user = await User.findById(userId);

        // Check if the user has a premium plan
        const today = new Date().toISOString().split("T")[0];
        const hasDownloadedToday = user.downloadHistory.includes(today);

        if (!user.isPremium && hasDownloadedToday) {
            return res.status(403).json({ message: "Free users can only download one video per day." });
        }

        // Find the video
        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ message: "Video not found." });

        // Update user’s download history
        if (!user.isPremium) {
            user.downloadHistory = [today]; // Reset previous downloads for the day
        }
        user.downloads.push(video._id);
        await user.save();

        res.json({ message: "Download successful", video });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getUserDownloads = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("downloads");

        if (!user) return res.status(404).json({ message: "User not found." });

        res.json({ downloads: user.downloads });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
