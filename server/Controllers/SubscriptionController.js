import SubscriptionModel from "../Models/SubscriptionModel.js";
import UserModel from "../Models/AuthModel.js";
import nodemailer from "nodemailer";

const PLANS = {
    Free: { duration: 5, cost: 0 },
    Bronze: { duration: 7, cost: 10 },
    Silver: { duration: 10, cost: 50 },
    Gold: { duration: null, cost: 100 },
};

// Simulated payment function
export const processPayment = async (userId, amount) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, transactionId: `TXN-${Date.now()}` }), 2000);
    });
};

export const upgradeSubscription = async (req, res) => {
    const { userId, plan } = req.body;

    if (!PLANS[plan]) return res.status(400).json({ message: "Invalid plan selected" });

    try {
        const paymentResult = await processPayment(userId, PLANS[plan].cost);
        if (!paymentResult.success) return res.status(400).json({ message: "Payment Failed!" });

        const expiresAt = PLANS[plan].duration ? new Date(Date.now() + PLANS[plan].duration * 86400000) : null;

        const subscription = await SubscriptionModel.findOneAndUpdate(
            { userId },
            { plan, expiresAt },
            { new: true, upsert: true }
        );

        await sendInvoiceEmail(userId, plan, PLANS[plan].cost, paymentResult.transactionId);
        res.status(200).json({ message: "Subscription upgraded successfully", subscription });

    } catch (error) {
        console.error("Upgrade Subscription Error:", error);
        res.status(500).json({ message: "Oops, Server error", error });
    }
};

// Function to send an invoice email
const sendInvoiceEmail = async (userId, plan, amount, transactionId) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) return;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Subscription Invoice",
            text: `Dear ${user.name},\n\nYou have successfully subscribed to the ${plan} plan.\n\nAmount Paid: ₹${amount}\nTransaction ID: ${transactionId}\n\nThank you for your support.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Invoice sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending invoice email:", error);
    }
};
