const express = require("express");
const Payment = require("../models/Payment");
const router = express.Router();

// Process payment
router.post("/", async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ error: "Payment failed" });
    }
});

// Get payment history by user
router.get("/:userId", async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.params.userId }).populate("order");
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch payments" });
    }
});

module.exports = router;
