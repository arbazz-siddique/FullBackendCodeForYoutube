import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../Models/AuthModel.js";

const razorpay = new Razorpay({
    key_id: "YOUR_RAZORPAY_KEY",
    key_secret: "YOUR_RAZORPAY_SECRET"
});

export const createPayment = async (req, res) => {
    try {
        const options = {
            amount: 100 * 100, // ₹100
            currency: "INR",
            receipt: `receipt_${req.user.id}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Payment initiation failed", error });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", "YOUR_RAZORPAY_SECRET")
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        // Update user to premium
        const user = await User.findById(req.user.id);
        user.isPremium = true;
        await user.save();

        res.json({ message: "Payment successful, Premium activated!" });
    } catch (error) {
        res.status(500).json({ message: "Payment verification failed", error });
    }
};
