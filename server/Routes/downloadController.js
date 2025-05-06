import express from "express"
import{} from ""
import authMiddleware from "../Middlewares/AuthMiddleware.js"
import { dwonloadVideo, getUserDownloads } from "../Controllers/downloadController.js";

const router = express.Router();

router.post("/download/:videoId", authMiddleware, dwonloadVideo )
router.get("/user-downloads", authMiddleware, getUserDownloads )