const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📌 Đảm bảo thư mục tồn tại
const uploadPath = "uploads/comments/";
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// 📦 Cấu hình lưu ảnh vào thư mục uploads/comments
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// 📦 Tạo instance multer cho bình luận
const uploadComment = multer({ storage });

module.exports = uploadComment;
