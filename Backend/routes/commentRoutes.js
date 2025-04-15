const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Order = require("../models/Order");
const Account = require("../models/Account");
const Vehicle = require("../models/Vehicle");
const uploadComment = require('../config/multerComment');

// 👉 API thêm bình luận
router.post("/", uploadComment.array("images", 5), async (req, res) => {
    const { userId, vehicleId, content } = req.body;
    const files = req.files;
    console.log(userId, vehicleId, content);

    // Kiểm tra xem các tham số có tồn tại không
    if (!userId || !vehicleId || !content) {
        return res.status(400).json({ error: "Thiếu thông tin yêu cầu (userId, vehicleId, content)." });
    }

    try {
        // Kiểm tra nếu user đã thuê xe
        const rented = await Order.findOne({
            "user._id": userId,
            "vehicles.vehicleId": vehicleId,
            status: { $in: ["Đã thanh toán"] }
        });

        if (!rented) {
            return res.status(403).json({ error: "Bạn cần thuê xe này trước khi bình luận." });
        }

        const user = await Account.findById(userId);
        const vehicle = await Vehicle.findById(vehicleId);

        if (!user || !vehicle) {
            return res.status(404).json({ error: "Người dùng hoặc xe không tồn tại." });
        }

        // Tạo mảng link ảnh nếu có ảnh được upload
        const imageUrls = Array.isArray(files) ? files.map(file => `${req.protocol}://${req.get("host")}/uploads/comments/${file.filename}`) : [];

        const comment = new Comment({
            user: {
                _id: user._id,
                name: user.fullname,
                avatar: user.avatar
            },
            vehicle: vehicle._id,
            vehicleName: vehicle.name,
            content,
            images: imageUrls
        });

        await comment.save();
        res.status(201).json({ message: "Đã bình luận thành công", comment });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi tạo bình luận" });
    }
});


// 👉 API Lấy tất cả bình luận của xe
router.get("/:vehicleId", async (req, res) => {
    const { vehicleId } = req.params;

    try {
        const comments = await Comment.find({ vehicle: vehicleId })
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian bình luận (mới nhất lên đầu)

        if (!comments || comments.length === 0) {
            return res.status(404).json({ error: "Không có bình luận cho xe này." });
        }

        res.status(200).json({ comments });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi lấy bình luận" });
    }
});

// 👉 API Cập nhật bình luận
router.put("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { userId, content, images = [] } = req.body;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: "Bình luận không tồn tại." });
        }

        if (comment.user._id.toString() !== userId) {
            return res.status(403).json({ error: "Bạn không có quyền sửa bình luận này." });
        }

        comment.content = content;
        comment.images = images;

        await comment.save();
        res.status(200).json({ message: "Cập nhật bình luận thành công", comment });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi cập nhật bình luận." });
    }
});

module.exports = router;
