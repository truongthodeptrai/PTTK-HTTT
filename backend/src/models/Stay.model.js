const { sql, pool } = require('../config/database');

const stayStatusMap = {
  0: 'pending_checkin',
  1: 'active',
  2: 'completed',
  3: 'cancelled',
};

const rentalTypeMap = {
  1: 'bed',
  2: 'room',
};

function mapStay(row) {
  if (!row) return null;

  return {
    id: row.MaHopDong,
    code: `HD${String(row.MaHopDong).padStart(6, '0')}`,
    status: stayStatusMap[row.TrangThai] || 'unknown',
    checkIn: row.NgayBatDau,
    checkOut: row.NgayKetThuc,
    paymentCycle: row.ChuKyThanhToan,
    cyclePrice: Number(row.GiaMotChuKyThanhToan),
    monthlyFee: Number(row.GiaMotChuKyThanhToan),
    rentalType: rentalTypeMap[row.HinhThucThue],
    bedCount: row.SoGiuongThue,
    customerId: row.MaKhachHang,
    customerName: row.HoTen,
    gender: row.GioiTinh,
    nationality: row.QuocTich,
    idNumber: row.CCCD,
    bookingId: row.MaDatCoc,
    roomId: row.MaPhong,
    roomName: row.TenPhong,
  };
}

class StayModel {
  static async findAll() {
    const db = await pool;
    const result = await db.request().query(`
      SELECT hd.MaHopDong, hd.TrangThai, hd.NgayBatDau, hd.NgayKetThuc,
             hd.ChuKyThanhToan, hd.GiaMotChuKyThanhToan, hd.HinhThucThue,
             hd.SoGiuongThue, hd.MaKhachHang, kh.HoTen, kh.GioiTinh,
             kh.QuocTich, kh.CCCD, hd.MaDatCoc, hd.MaPhong, p.TenPhong
      FROM HopDong hd
      INNER JOIN KhachHang kh ON kh.MaKhachHang = hd.MaKhachHang
      INNER JOIN Phong p ON p.MaPhong = hd.MaPhong
      ORDER BY hd.MaHopDong DESC
    `);

    return result.recordset.map(mapStay);
  }

  static async findById(id) {
    const db = await pool;
    const result = await db.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT hd.MaHopDong, hd.TrangThai, hd.NgayBatDau, hd.NgayKetThuc,
               hd.ChuKyThanhToan, hd.GiaMotChuKyThanhToan, hd.HinhThucThue,
               hd.SoGiuongThue, hd.MaKhachHang, kh.HoTen, kh.GioiTinh,
               kh.QuocTich, kh.CCCD, hd.MaDatCoc, hd.MaPhong, p.TenPhong
        FROM HopDong hd
        INNER JOIN KhachHang kh ON kh.MaKhachHang = hd.MaKhachHang
        INNER JOIN Phong p ON p.MaPhong = hd.MaPhong
        WHERE hd.MaHopDong = @id
      `);

    return mapStay(result.recordset[0]);
  }
}

module.exports = StayModel;

