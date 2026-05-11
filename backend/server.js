const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require('./src/routes/auth.routes'); 

const app = express();

// --- TẦNG MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

app.use('/api', authRoutes);

// Route cho Phòng
app.use("/api/phong", require("./src/routes/room.routes"));

// --- KHỞI CHẠY SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Server đang chạy tại port: ${PORT}`);
  console.log(`Endpoint Login: POST http://localhost:${PORT}/api/login`);
  console.log(`=========================================`);
});