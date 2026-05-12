const { sql, pool } = require('../config/database');

const depositStatusMap = {
  0: 'pending',
  1: 'approved',
  2: 'rejected',
  3: 'expired',
};

const depositStatusValueMap = {
  pending: 0,
  approved: 1,
  rejected: 2,
  expired: 3,
};

const rentalTypeMap = {
  1: 'bed',
  2: 'room',
};


function mapBooking(row) {
  if (!row) return null;

  return {
    id: row.MaDatCoc,
    code: `DC${String(row.MaDatCoc).padStart(6, '0')}`,
    customerId: row.MaKhachHang,
    customerName: row.HoTen,
    roomId: row.MaPhong,
    roomName: row.TenPhong,
    amount: Number(row.SoTienCoc),
    status: depositStatusMap[row.TrangThai] || 'unknown',
    createdAt: row.NgayDatCoc,
    paymentDeadline: row.HanThanhToan,
    rentalType: rentalTypeMap[row.HinhThucThue],
    bedCount: row.SoGiuongDat,
  };
}

class BookingModel {
  static async findAll() {
    const db = await pool;
    const result = await db.request().query(`
      SELECT dc.MaDatCoc, dc.SoTienCoc, dc.NgayDatCoc, dc.HanThanhToan,
             dc.TrangThai, dc.HinhThucThue, dc.SoGiuongDat,
             dc.MaPhong, p.TenPhong, dc.MaKhachHang, kh.HoTen
      FROM DatCoc dc
      INNER JOIN KhachHang kh ON kh.MaKhachHang = dc.MaKhachHang
      INNER JOIN Phong p ON p.MaPhong = dc.MaPhong
      ORDER BY dc.MaDatCoc DESC
    `);

    return result.recordset.map(mapBooking);
  }

  static async findById(id) {
    const db = await pool;
    const result = await db.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT dc.MaDatCoc, dc.SoTienCoc, dc.NgayDatCoc, dc.HanThanhToan,
               dc.TrangThai, dc.HinhThucThue, dc.SoGiuongDat,
               dc.MaPhong, p.TenPhong, dc.MaKhachHang, kh.HoTen
        FROM DatCoc dc
        INNER JOIN KhachHang kh ON kh.MaKhachHang = dc.MaKhachHang
        INNER JOIN Phong p ON p.MaPhong = dc.MaPhong
        WHERE dc.MaDatCoc = @id
      `);

    return mapBooking(result.recordset[0]);
  }

  static async findByCustomerId(customerId) {
    const db = await pool;
    const result = await db.request()
      .input('customerId', sql.Int, customerId)
      .query(`
        SELECT dc.MaDatCoc, dc.SoTienCoc, dc.NgayDatCoc, dc.HanThanhToan,
               dc.TrangThai, dc.HinhThucThue, dc.SoGiuongDat,
               dc.MaPhong, p.TenPhong, dc.MaKhachHang, kh.HoTen
        FROM DatCoc dc
        INNER JOIN KhachHang kh ON kh.MaKhachHang = dc.MaKhachHang
        INNER JOIN Phong p ON p.MaPhong = dc.MaPhong
        WHERE dc.MaKhachHang = @customerId
        ORDER BY dc.MaDatCoc DESC
      `);

    return result.recordset.map(mapBooking);
  }

  static async create(booking) {
    const db = await pool;
    const result = await db.request()
      .input('amount', sql.Decimal(19, 4), booking.amount)
      .input('paymentDeadline', sql.DateTime, booking.paymentDeadline || booking.deadline)
      .input('status', sql.Int, depositStatusValueMap[booking.status] ?? 0)
      .input('rentalType', sql.Int, booking.rentalType || booking.hinhThucThue || 1)
      .input('bedCount', sql.Int, booking.bedCount || booking.soGiuongDat || 1)
      .input('roomId', sql.Int, booking.roomId)
      .input('customerId', sql.Int, booking.customerId)
      .query(`
        INSERT INTO DatCoc (
          SoTienCoc, HanThanhToan, TrangThai, HinhThucThue,
          SoGiuongDat, MaPhong, MaKhachHang
        )
        OUTPUT INSERTED.MaDatCoc
        VALUES (
          @amount, @paymentDeadline, @status, @rentalType,
          @bedCount, @roomId, @customerId
        )
      `);

    return this.findById(result.recordset[0].MaDatCoc);
  }

  static async updateStatus(id, status) {
    const db = await pool;
    await db.request()
      .input('id', sql.Int, id)
      .input('status', sql.Int, depositStatusValueMap[status])
      .query(`
        UPDATE DatCoc
        SET TrangThai = @status
        WHERE MaDatCoc = @id
      `);

    return this.findById(id);
  }

  static async approve(id) {
    return this.updateStatus(id, 'approved');
  }

  static async reject(id) {
    return this.updateStatus(id, 'rejected');
  }
}

module.exports = BookingModel;
