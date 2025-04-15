const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    amountPaid: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "credit_card", "momo", "bank_transfer"], default: "cash" },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    transactionId: { type: String, unique: true, default: uuidv4 },
    paymentDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Chờ nhận xe', 'Thành công', 'Đã hủy'],
        default: 'Chờ nhận xe'
    }
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
