const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();

// Tạo thông báo
router.post("/create", async (req, res) => {
  try {
    const { userId, title, message } = req.body;

    const newNoti = new Notification({
      userId,
      title,
      message
    });

    await newNoti.save();
    res.status(200).json({ message: "Notification created", notification: newNoti });
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// Lấy danh sách thông báo theo user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to get notifications" });
  }
});

// Đánh dấu đã đọc
router.put("/read/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

module.exports = router;
