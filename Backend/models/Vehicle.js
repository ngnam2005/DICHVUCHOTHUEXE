const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    yearManufactured: { type: Number },
    rentalPricePerDay: { type: Number, required: true },
    quantity:{type: Number, require: true, default: 1},
    type: { type: mongoose.Schema.Types.ObjectId, ref: "Type", required: true },
    status: { type: String, enum: ["available", "reserved", "in_use", "maintenance"], default: "available" },
    images: { type: [String], default: [] } 
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", VehicleSchema);
