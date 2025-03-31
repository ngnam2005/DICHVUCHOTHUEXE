const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

// Create order
router.post("/", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: "Failed to create order" });
    }
});

// Get all orders by user
router.get("/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).populate("vehicles");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

module.exports = router;
