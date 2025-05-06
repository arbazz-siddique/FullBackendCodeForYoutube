import express from "express";
import { createPayment, verifyPayment } from "../Controllers/paymentController.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/create-payment", authMiddleware, createPayment);
router.post("/verify-payment", authMiddleware, verifyPayment);

export default router;
