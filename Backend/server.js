const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const accountsRoutes = require("./routes/accountsRoutes");
const typeRoutes = require("./routes/typeRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


require("dotenv").config();
connectDB(); // Kết nối MongoDB

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));


// Routes chính
app.use("/api/accounts", accountsRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));
