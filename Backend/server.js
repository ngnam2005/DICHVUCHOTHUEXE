const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const accountsRoutes = require("./routes/accountsRoutes");
const typeRoutes = require("./routes/typeRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const commentRoutes = require("./routes/commentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

require("dotenv").config();
connectDB(); // Kết nối MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Cho phép truy cập ảnh đã upload
app.use("/uploads", express.static("uploads"));

// ✅ Sử dụng các routes
app.use("/api/accounts", accountsRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));
