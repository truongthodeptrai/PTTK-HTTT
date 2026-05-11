const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Để server hiểu được dữ liệu JSON từ Frontend gửi lên

// Kết nối Database (Tạm thời để đây, sau này chuyển vào src/config)
// const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGO_URI).then(() => console.log("DB Connected"));

// Khai báo các Routes
app.use("/api/rooms", require("./src/routes/room.routes"));

app.use("/api/customers", require("./src/routes/customer.routes"));
// app.use('/api/deposits', require('./src/routes/datCoc'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port: ${PORT}`);
});
