import express from "express";
import auth from "../Middlewares/AuthMiddleware.js";
import { creategroup, deletegroup, getallgroups, joingroup, searchGroups,leavegroup, sendMessage, getMessages  } from "../Controllers/GroupController.js";

const router = express.Router();

router.post("/create",auth, creategroup);
router.get("/all", getallgroups);
router.post("/join/:groupId", auth, joingroup);
router.get("/search", searchGroups);
router.delete("/delete/:id", auth, deletegroup);
router.post("/leave/:id", auth, leavegroup);
router.post("/:groupId/messages", auth, sendMessage);
router.get("/:groupId/messages", auth, getMessages);

export default router;