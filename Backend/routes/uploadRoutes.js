// Cập nhật API upload ảnh
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Cấu hình lưu ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/comments/"); // 📌 Thư mục chứa ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // 📌 Đổi tên file tránh trùng
    }
});

const upload = multer({ storage });

router.post("/", upload.array("images", 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Không có file được upload" });
    }

    const fileUrls = req.files.map(file => `/uploads/comments/${file.filename}`);
    res.status(200).json({ urls: fileUrls });
});

module.exports = router;
