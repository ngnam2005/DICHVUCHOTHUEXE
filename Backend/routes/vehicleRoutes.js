const express = require("express");
const Vehicle = require("../models/Vehicle");
const upload = require("../config/multer");

const router = express.Router();

// 📌 Tạo xe mới (có hỗ trợ upload nhiều ảnh)
router.post("/add", upload.array("images", 5), async (req, res) => {
    try {
        const { name, brand, yearManufactured, rentalPricePerDay, type, status } = req.body;

        // 🌟 Lấy danh sách ảnh đã upload
        const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const newVehicle = new Vehicle({
            name,
            brand,
            yearManufactured,
            rentalPricePerDay,
            type,
            status,
            images: imageUrls, // 🌟 Lưu danh sách ảnh
        });

        await newVehicle.save();
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(500).json({ error: "Failed to create vehicle" });
    }
});

// 📌 Cập nhật thông tin xe (có hỗ trợ update nhiều ảnh)
router.put("/update/:id", upload.array("images", 5), async (req, res) => {
    try {
        const { name, brand, yearManufactured, rentalPricePerDay, type, status } = req.body;
        const updateData = { name, brand, yearManufactured, rentalPricePerDay, type, status };

        // 🌟 Nếu có ảnh mới, cập nhật danh sách ảnh
        if (req.files) updateData.images = req.files.map(file => `/uploads/${file.filename}`);

        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedVehicle) return res.status(404).json({ error: "Vehicle not found" });

        res.json(updatedVehicle);
    } catch (error) {
        res.status(500).json({ error: "Failed to update vehicle" });
    }
});

// 📌 Lấy danh sách xe (populate type)
router.get("/getAll", async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate("type", "name description");
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch vehicles" });
    }
});

// 📌 Lấy thông tin xe theo ID (có danh sách ảnh)
router.get("/getById/:id", async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate("type", "name description");
        if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch vehicle" });
    }
});

// 📌 Xóa xe
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) return res.status(404).json({ error: "Vehicle not found" });

        res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete vehicle" });
    }
});

module.exports = router;
