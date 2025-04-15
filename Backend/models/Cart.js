const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    vehicles: [
        {
            vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
            name: { type: String, required: true },
            image: { type: String, required: true },
            rentalPricePerDay: { type: Number, required: true },
            quantity: { type: Number, required: true, default: 1 },
        }
    ],
    rentalStartDate: { type: Date, required: true },
    rentalEndDate: { type: Date, required: true },
    rentalDays: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);
