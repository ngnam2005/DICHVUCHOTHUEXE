const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { v4: uuidv4 } = require('uuid');

// Tạo thanh toán
router.post("/create", async (req, res) => {
    try {
        const { orderId, userId, amount, method } = req.body;

        const newPayment = new Payment({
            orderId,
            userId,
            amount,
            method,
            status: "Chờ xử lý",
            transactionId: uuidv4()  // Thêm transactionId mới tạo
        });

        await newPayment.save();

        res.status(201).json({ message: "Tạo thanh toán thành công", payment: newPayment });
    } catch (err) {
        console.error("Lỗi tạo thanh toán:", err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

// Xác nhận thanh toán
router.put("/confirm/:paymentId", async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId);
        if (!payment) return res.status(404).json({ message: "Không tìm thấy thanh toán" });

        payment.status = "Đã thanh toán";
        payment.paidAt = new Date();
        await payment.save();

        // Cập nhật trạng thái đơn hàng
        await Order.findByIdAndUpdate(payment.orderId, {
            paymentStatus: "Đã thanh toán"
        });

        res.status(200).json({ message: "Xác nhận thanh toán thành công", payment });
    } catch (err) {
        console.error("Lỗi xác nhận thanh toán:", err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});

// Lấy tất cả thanh toán theo userId
router.get("/user/:userId", async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.params.userId })
            .populate("orderId")
            .sort({ createdAt: -1 }); // Sắp xếp mới nhất lên đầu

        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: "Không có thanh toán nào cho người dùng này" });
        }

        res.status(200).json({ payments });
    } catch (err) {
        console.error("Lỗi khi lấy thanh toán theo userId:", err);
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});


module.exports = router;
