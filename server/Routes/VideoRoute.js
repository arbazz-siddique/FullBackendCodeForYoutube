import express from "express";
import { likevideocontroller } from "../Controllers/LikeController.js";
import { viewscontroller } from "../Controllers/ViewsController.js";
import { uploadvideo, getallvideos, } from "../Controllers/VideoController.js"; // Import getVideoById
import upload from "../Helper/filehelper.js";
import auth from "../Middlewares/AuthMiddleware.js";
import { historycontroller, deletehistory, getallhistorycontroller } from "../Controllers/HistoryController.js";
import { watchlatercontroller, getallwatchlatercontroller, deletewatchlater } from "../Controllers/WatchlaterController.js";
import { likedvideocontroller, getalllikedvideo, deletelikedvideo } from "../Controllers/LikevideoController.js";
import path from "path";  // Import path module
import fs from "fs";
import videofile from "../Models/VideofileModel.js";
const routes = express.Router();

routes.post("/uploadvideo", upload.single("file"), uploadvideo);

routes.post("/history", historycontroller);
routes.get("/getallhistory", getallhistorycontroller);
routes.delete("/deletehistory/:userid", deletehistory);

routes.get("/getvideos", getallvideos);
routes.patch("/like/:id", auth, likevideocontroller);
routes.patch("/views/:id", viewscontroller);

// ✅ Download Video Route (New)
routes.get("/download/:id", async (req, res) => {  // 🔥 Fix: Remove /videos/ prefix if necessary
    try {
        const video = await videofile.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const filePath = path.resolve(video.filepath);
        console.log("File path:", filePath); // Debugging log

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found on server" });
        }

        await videofile.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });

        res.download(filePath, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });

    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ message: "Server error" });
    }
});





//  Modify Watch Later and Like Video Routes
routes.post("/watchlater",auth, watchlatercontroller);
routes.get("/getallwatchlater", getallwatchlatercontroller);
routes.delete("/deletewatchlater/:videoid/:viewer", auth, deletewatchlater);

routes.post("/likevideo", auth, likedvideocontroller);
routes.get("/getalllikevide", getalllikedvideo);
routes.delete("/deletelikevideo/:videoid/:viewer", auth, deletelikedvideo);

export default routes;
