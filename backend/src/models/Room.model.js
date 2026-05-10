// backend/src/models/Phong.js
const mongoose = require("mongoose");

const PhongSchema = new mongoose.Schema({
  maPhong: { type: String, required: true },
  giaNguyenPhong: String,
  giaGiuong: String,
  loaiPhong: String,
  soNguoiHienTai: Number,
  soNguoiToiDa: Number,
  trangThai: {
    type: String,
    enum: ["green", "red", "yellow"], // Tương ứng với màu sắc trên giao diện
    default: "green",
  },
});

module.exports = mongoose.model("Phong", PhongSchema);
