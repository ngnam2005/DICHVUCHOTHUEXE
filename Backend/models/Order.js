const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
        fullname: { type: String, required: true },
        avatar: { type: String }
    },
    vehicles: [
        {
            vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
            name: { type: String, required: true },
            image: { type: String },
            rentalPricePerDay: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    rentalStartDate: { type: Date, required: true },
    rentalEndDate: { type: Date, required: true },
    rentalDays: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Đã thanh toán" },
    
    // 👉 Thêm phương thức thanh toán:
    paymentMethod: {
        type: String,
        enum: ['Tiền mặt', 'Chuyển khoản'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
