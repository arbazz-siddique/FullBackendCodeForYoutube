import express from "express"

import { getcomment,deletecomment,postcomment,editcomment, translateComment, dislikecomment, likecomment } from "../Controllers/CommentController.js"
import auth from "../Middlewares/AuthMiddleware.js"

const router = express.Router();

router.post("/post", auth, postcomment)
router.get("/get", getcomment)
router.delete("/delete/:id", auth, deletecomment)
router.patch("/edit/:id", auth, editcomment)
router.patch("/like/:id", likecomment);
router.patch('/dislike/:id', auth, dislikecomment);
router.post("/translate", translateComment);
export default router 