const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true }],
    rentalStartDate: { type: Date, required: true },
    rentalEndDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "canceled"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
