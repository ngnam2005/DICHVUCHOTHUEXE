const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ Tạo đơn hàng
router.post("/create", async (req, res) => {
    const {
        user,
        vehicles,
        rentalStartDate,
        rentalEndDate,
        rentalDays,
        totalPrice,
        paymentMethod
    } = req.body;

    try {
        // Kiểm tra dữ liệu đầu vào
        if (!user || !user._id || !vehicles || vehicles.length === 0) {
            return res.status(400).json({ error: "Thiếu thông tin đơn hàng." });
        }

        const newOrder = new Order({
            user,
            vehicles,
            rentalStartDate: new Date(rentalStartDate),
            rentalEndDate: new Date(rentalEndDate),
            rentalDays,
            totalPrice,
            paymentMethod: paymentMethod || "Tiền mặt",
            status: 'Chờ nhận xe'
        });

        await newOrder.save();
        res.status(201).json({ message: "Tạo đơn hàng thành công", order: newOrder });

    } catch (err) {
        console.error("Lỗi tạo đơn hàng:", err);
        res.status(500).json({ error: "Lỗi máy chủ khi tạo đơn hàng" });
    }
});

// ✅ Lấy đơn hàng theo userId
router.get('/getOrderById/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ 'user._id': req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
        res.status(500).json({ message: "Lỗi server", error: err });
    }
});

// ✅ Hủy đơn hàng
router.put('/cancel/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        // Đảm bảo trạng thái hiện tại cho phép hủy
        if (order.status === 'Đã hủy') {
            return res.status(400).json({ message: 'Đơn hàng đã bị hủy trước đó' });
        }

        const today = new Date();
        const rentalStart = new Date(order.rentalStartDate);

        if (isNaN(rentalStart.getTime())) {
            return res.status(400).json({ message: 'Ngày bắt đầu thuê không hợp lệ' });
        }

        const timeDiff = rentalStart.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysLeft <= 1) {
            return res.status(400).json({ message: 'Không thể hủy vì chỉ còn 1 ngày là đến ngày nhận xe' });
        }

        order.status = 'Đã hủy';
        await order.save();

        res.status(200).json({ message: 'Đã hủy đơn hàng thành công', order });
    } catch (err) {
        console.error("Lỗi khi hủy đơn:", err);
        res.status(500).json({ message: 'Lỗi server', error: err });
    }
});

module.exports = router;
