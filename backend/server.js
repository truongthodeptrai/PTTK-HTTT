const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/auth.routes");

const app = express();

// --- TẦNG MIDDLEWARE ---
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

// Khai báo các Routes
app.use("/api/rooms", require("./src/routes/room.routes"));
app.use("/api/customers", require("./src/routes/customer.routes"));
app.use("/api/employees", require("./src/routes/employee.routes"));
// app.use('/api/deposits', require('./src/routes/datCoc'));

// --- KHỞI CHẠY SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Server đang chạy tại port: ${PORT}`);
  console.log(`Endpoint Login: POST http://localhost:${PORT}/api/login`);
  console.log(`=========================================`);
});
