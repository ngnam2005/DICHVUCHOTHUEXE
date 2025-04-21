const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");  // Thêm thư viện UUID

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['Tiền mặt', 'Chuyển khoản'], required: true },
    status: { type: String, enum: ['Chờ xử lý', 'Đã thanh toán', 'Thất bại'], default: 'Chờ xử lý' },
    paidAt: { type: Date }, // thời gian đã thanh toán
    transactionId: { type: String, unique: true, required: true, default: uuidv4 },  // Thêm transactionId
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
