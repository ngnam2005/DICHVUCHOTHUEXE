const express = require("express");
const Cart = require("../models/Cart");
const Vehicle = require("../models/Vehicle");
const router = express.Router();

// Add vehicle to cart
// ADD: Thêm vehicle vào giỏ hàng
router.post("/add", async (req, res) => {
    const { userId, vehicleId, name, image, rentalPricePerDay, quantity = 1, rentalStartDate, rentalEndDate } = req.body;

    try {
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: "Xe không tồn tại" });
        }

        // Kiểm tra tồn kho
        const maxAvailable = vehicle.quantity;
        let cart = await Cart.findOne({ user: userId });

        const rentalDays = rentalStartDate && rentalEndDate
            ? Math.ceil((new Date(rentalEndDate) - new Date(rentalStartDate)) / (1000 * 60 * 60 * 24)) + 1
            : 1;

        if (!cart) {
            if (quantity > maxAvailable) {
                return res.status(400).json({ error: "Số lượng vượt quá số xe còn lại" });
            }

            cart = new Cart({
                user: userId,
                vehicles: [{
                    vehicleId,
                    name,
                    image,
                    rentalPricePerDay,
                    quantity,
                }],
                rentalStartDate: rentalStartDate || new Date(),
                rentalEndDate: rentalEndDate || new Date(),
                rentalDays,
                totalPrice: rentalPricePerDay * rentalDays * quantity,
            });
        } else {
            const existingVehicle = cart.vehicles.find(v => v.vehicleId.toString() === vehicleId);
            if (existingVehicle) {
                const newQuantity = existingVehicle.quantity + quantity;
                if (newQuantity > maxAvailable) {
                    return res.status(400).json({ error: "Số lượng vượt quá số xe còn lại" });
                }
                existingVehicle.quantity = newQuantity;
            } else {
                if (quantity > maxAvailable) {
                    return res.status(400).json({ error: "Số lượng vượt quá số xe còn lại" });
                }
                cart.vehicles.push({ vehicleId, name, image, rentalPricePerDay, quantity });
            }

            cart.totalPrice = cart.vehicles.reduce((total, v) => {
                return total + v.rentalPricePerDay * cart.rentalDays * v.quantity;
            }, 0);
        }

        await cart.save();
        res.status(200).json({ message: "Vehicle added to cart", cart });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ error: "Failed to add vehicle to cart" });
    }
});

// PUT: Update quantity of a vehicle in cart
router.put("/:userId/vehicle/:vehicleId", async (req, res) => {
    const { userId, vehicleId } = req.params;
    const { quantity } = req.body;

    try {
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ error: "Xe không tồn tại" });

        if (quantity > vehicle.quantity) {
            return res.status(400).json({ error: "Số lượng vượt quá số xe còn lại" });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const vehicleItem = cart.vehicles.find(v => v.vehicleId.toString() === vehicleId);
        if (!vehicleItem) return res.status(404).json({ error: "Vehicle not found in cart" });

        vehicleItem.quantity = quantity;

        cart.totalPrice = cart.vehicles.reduce((sum, v) => {
            return sum + v.rentalPricePerDay * cart.rentalDays * v.quantity;
        }, 0);

        await cart.save();
        res.json({ message: "Quantity updated", cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update quantity" });
    }
});


// GET cart by user with populated vehicle info
router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate("vehicles.vehicleId");
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart" });
    }
});


// DELETE: Xóa một vehicle khỏi giỏ hàng của user
router.delete("/:userId/vehicle/:vehicleId", async (req, res) => {
    const { userId, vehicleId } = req.params;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.vehicles = cart.vehicles.filter(
            (v) => v.vehicleId.toString() !== vehicleId
        );

        if (cart.vehicles.length > 0) {
            // Tính lại totalPrice
            const newTotal = cart.vehicles.reduce((total, v) => {
                return total + (v.rentalPricePerDay * cart.rentalDays);
            }, 0);

            cart.totalPrice = newTotal;

            await cart.save();
            res.json({ message: "Vehicle removed", cart });
        } else {
            await Cart.deleteOne({ user: userId });
            res.json({ message: "Cart is now empty and has been removed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to remove vehicle from cart" });
    }
});



module.exports = router;
