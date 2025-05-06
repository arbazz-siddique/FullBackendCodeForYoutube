import express from "express";
import { getUserRegion } from "../Controllers/locationController.js";
const router = express.Router();

router.get("/get/location", getUserRegion);

export default router;
