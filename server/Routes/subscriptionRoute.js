import express from "express";
import { processPayment, upgradeSubscription } from "../Controllers/SubscriptionController.js";

const router = express.Router();

router.post("/upgrade", upgradeSubscription);
router.post("/payment", processPayment)

export default router;

