const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
        name: { type: String, required: true },
        avatar: { type: String }
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true},
    vehicleName: {  type: String,required: true},
    content: { type: String, required: true },
    images: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
