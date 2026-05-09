// module.exports = router;
const express = require("express");
const router = express.Router();

// Đây là "Database tạm thời" của bạn.
// Sau này khi có MongoDB, bạn chỉ cần xóa mảng này và dùng lệnh Phong.find()
const mockupDatabase = [
  {
    _id: "663b1a2e1", // Giả lập ID của MongoDB
    maPhong: "Phòng 101",
    giaNguyenPhong: "6.000.000đ",
    giaGiuong: "1.600.000đ",
    loaiPhong: "KTX Nam",
    soNguoiHienTai: 3,
    soNguoiToiDa: 4,
    trangThai: "green",
  },
  {
    _id: "663b1a2e2",
    maPhong: "Phòng 102",
    giaNguyenPhong: "6.000.000đ",
    giaGiuong: "1.600.000đ",
    loaiPhong: "KTX Nam",
    soNguoiHienTai: 2,
    soNguoiToiDa: 4,
    trangThai: "red",
  },
  {
    _id: "663b1a2e3",
    maPhong: "Phòng 103",
    giaNguyenPhong: "4.000.000đ",
    giaGiuong: "1.200.000đ",
    loaiPhong: "KTX Nam",
    soNguoiHienTai: 2,
    soNguoiToiDa: 4,
    trangThai: "yellow",
  },

  {
    _id: "663b1a2e4",
    maPhong: "Phòng 201",
    giaNguyenPhong: "5.000.000đ",
    giaGiuong: "1.500.000đ",
    loaiPhong: "KTX Nữ",
    soNguoiHienTai: 1,
    soNguoiToiDa: 4,
    trangThai: "green",
  },
  {
    _id: "663b1a2e5",
    maPhong: "Phòng 202",
    giaNguyenPhong: "5.000.000đ",
    giaGiuong: "1.500.000đ",
    loaiPhong: "KTX Nữ",
    soNguoiHienTai: 2,
    soNguoiToiDa: 4,
    trangThai: "red",
  },
  {
    _id: "663b1a2e6",
    maPhong: "Phòng 203",
    giaNguyenPhong: "5.000.000đ",
    giaGiuong: "1.500.000đ",
    loaiPhong: "KTX Nữ",
    soNguoiHienTai: 3,
    soNguoiToiDa: 4,
    trangThai: "yellow",
  },
  {
    _id: "663b1a2e7",
    maPhong: "Phòng 204",
    giaNguyenPhong: "5.000.000đ",
    giaGiuong: "1.500.000đ",
    loaiPhong: "KTX Nữ",
    soNguoiHienTai: 4,
    soNguoiToiDa: 4,
    trangThai: "green",
  },
  {
    _id: "663b1a2e8",
    maPhong: "Phòng 205",
    giaNguyenPhong: "5.000.000đ",
    giaGiuong: "1.500.000đ",
    loaiPhong: "KTX Nữ",
    soNguoiHienTai: 0,
    soNguoiToiDa: 4,
    trangThai: "red",
  },
];

// Route lấy danh sách phòng
router.get("/", (req, res) => {
  console.log("Frontend đang gọi lấy danh sách phòng...");
  res.json(mockupDatabase);
});

module.exports = router;
