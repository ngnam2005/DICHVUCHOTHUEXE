const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // 📌 Thư mục lưu ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // 📌 Đổi tên file tránh trùng
    }
});

const upload = multer({ storage });
module.exports = upload;
