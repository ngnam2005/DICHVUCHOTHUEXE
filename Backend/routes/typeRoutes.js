const express = require("express");
const Type = require("../models/Type");
const upload = require("../config/multer");

const router = express.Router();

//Tạo loại xe mới (kiểm tra trùng tên + upload ảnh)
router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { name } = req.body;

        // Kiểm tra xem loại xe đã tồn tại chưa
        const existingType = await Type.findOne({ name });
        if (existingType) {
            return res.status(400).json({ error: "Type name already exists" });
        }

        //Lưu ảnh nếu có upload
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const newType = new Type({ name, image: imageUrl });
        await newType.save();

        res.status(201).json(newType);
    } catch (error) {
        res.status(500).json({ error: "Failed to create type", details: error.message });
    }
});

router.get("/getById/:typeId", async (req, res) => {
    try {
        const { typeId } = req.params;
        
        // Tìm loại xe theo typeId
        const type = await Type.findById(typeId);
        if (!type) {
            return res.status(404).json({ error: "Type not found" });
        }

        res.json(type);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch type by ID", details: error.message });
    }
});

//Lấy danh sách loại xe 
router.get("/getAll", async (req, res) => {
    try {
        const { name } = req.query;
        let query = {};
        if (name) query.name = new RegExp(name, "i"); 

        const types = await Type.find(query);
        res.json(types);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch types" });
    }
});

//Cập nhật loại xe
router.put("/update/:id", upload.single("image"), async (req, res) => {
    try {
        const { name } = req.body;
        let updateData = { name };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedType = await Type.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedType) return res.status(404).json({ error: "Type not found" });

        res.json(updatedType);
    } catch (error) {
        res.status(500).json({ error: "Failed to update type", details: error.message });
    }
});

//Xóa loại xe
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedType = await Type.findByIdAndDelete(req.params.id);
        if (!deletedType) return res.status(404).json({ error: "Type not found" });

        res.json({ message: "Type deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete type", details: error.message });
    }
});

module.exports = router;
