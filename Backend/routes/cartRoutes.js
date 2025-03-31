const express = require("express");
const Cart = require("../models/Cart");
const Vehicle = require("../models/Vehicle");
const router = express.Router();

// Add vehicle to cart
router.post("/add", async (req, res) => {
    try {
        const { user, vehicles, rentalStartDate, rentalEndDate, rentalDays, totalPrice } = req.body;
        const cart = new Cart({ user, vehicles, rentalStartDate, rentalEndDate, rentalDays, totalPrice });
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to add to cart" });
    }
});

// Get cart by user
router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate("vehicles");
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart" });
    }
});

module.exports = router;
