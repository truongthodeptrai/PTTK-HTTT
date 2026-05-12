const { sql, getPool } = require('../config/database');

const paymentStatusMap = {
  0: 'pending',
  1: 'completed',
  2: 'cancelled',
  3: 'due'
};

const paymentStatusValueMap = {
  pending: 0,
  completed: 1,
  cancelled: 2,
  due: 3
};

const paymentMethodMap = {
  1: cash,
  2: transfer
};

function mapPayment(row) {
  if (!row) return null;

  return {
    id: row.MaThanhToan,
    bookingId: row.MaDatCoc,
    bookingCode: row.MaDatCoc ? `DC${String(row.MaDatCoc).padStart(6, '0')}` : null,
    contractId: row.MaHopDong,
    customerId: row.MaKhachHang,
    customerName: row.HoTen,
    amount: Number(row.SoTien),
    method: paymentMethodMap[row.PhuongThuc],
    type: row.LoaiThanhToan,
    paymentPeriod: row.KyThanhToan,
    status: paymentStatusMap[row.TrangThai] || 'unknown',
  };
}

class PaymentModel {
  static async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT tt.MaThanhToan, tt.SoTien, tt.PhuongThuc, tt.TrangThai,
             tt.LoaiThanhToan, tt.KyThanhToan, tt.MaDatCoc, tt.MaHopDong,
             COALESCE(dc.MaKhachHang, hd.MaKhachHang) AS MaKhachHang,
             kh.HoTen
      FROM ThanhToan tt
      LEFT JOIN DatCoc dc ON dc.MaDatCoc = tt.MaDatCoc
      LEFT JOIN HopDong hd ON hd.MaHopDong = tt.MaHopDong
      LEFT JOIN KhachHang kh ON kh.MaKhachHang = COALESCE(dc.MaKhachHang, hd.MaKhachHang)
      ORDER BY tt.MaThanhToan DESC
    `);

    return result.recordset.map(mapPayment);
  }

  static async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT tt.MaThanhToan, tt.SoTien, tt.PhuongThuc, tt.TrangThai,
               tt.LoaiThanhToan, tt.KyThanhToan, tt.MaDatCoc, tt.MaHopDong,
               COALESCE(dc.MaKhachHang, hd.MaKhachHang) AS MaKhachHang,
               kh.HoTen
        FROM ThanhToan tt
        LEFT JOIN DatCoc dc ON dc.MaDatCoc = tt.MaDatCoc
        LEFT JOIN HopDong hd ON hd.MaHopDong = tt.MaHopDong
        LEFT JOIN KhachHang kh ON kh.MaKhachHang = COALESCE(dc.MaKhachHang, hd.MaKhachHang)
        WHERE tt.MaThanhToan = @id
      `);

    return mapPayment(result.recordset[0]);
  }

  static async findByCustomerId(customerId) {
    const pool = await getPool();
    const result = await pool.request()
      .input('customerId', sql.Int, customerId)
      .query(`
        SELECT tt.MaThanhToan, tt.SoTien, tt.PhuongThuc, tt.TrangThai,
               tt.LoaiThanhToan, tt.KyThanhToan, tt.MaDatCoc, tt.MaHopDong,
               COALESCE(dc.MaKhachHang, hd.MaKhachHang) AS MaKhachHang,
               kh.HoTen
        FROM ThanhToan tt
        LEFT JOIN DatCoc dc ON dc.MaDatCoc = tt.MaDatCoc
        LEFT JOIN HopDong hd ON hd.MaHopDong = tt.MaHopDong
        LEFT JOIN KhachHang kh ON kh.MaKhachHang = COALESCE(dc.MaKhachHang, hd.MaKhachHang)
        WHERE COALESCE(dc.MaKhachHang, hd.MaKhachHang) = @customerId
        ORDER BY tt.MaThanhToan DESC
      `);

    return result.recordset.map(mapPayment);
  }

  static async create(payment) {
    const pool = await getPool();
    const result = await pool.request()
      .input('amount', sql.Decimal(19, 4), payment.amount)
      .input('method', sql.Int, paymentMethodValueMap[payment.method] || payment.method || 1)
      .input('status', sql.Int, paymentStatusValueMap[payment.status] ?? 0)
      .input('type', sql.VarChar(50), payment.type)
      .input('paymentPeriod', sql.Int, payment.paymentPeriod || null)
      .input('bookingId', sql.Int, payment.bookingId || null)
      .input('contractId', sql.Int, payment.contractId || null)
      .query(`
        INSERT INTO ThanhToan (
          SoTien, PhuongThuc, TrangThai, LoaiThanhToan,
          KyThanhToan, MaDatCoc, MaHopDong
        )
        OUTPUT INSERTED.MaThanhToan
        VALUES (
          @amount, @method, @status, @type,
          @paymentPeriod, @bookingId, @contractId
        )
      `);

    return this.findById(result.recordset[0].MaThanhToan);
  }

  static async updateStatus(id, status) {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.Int, paymentStatusValueMap[status])
      .query(`
        UPDATE ThanhToan
        SET TrangThai = @status
        WHERE MaThanhToan = @id
      `);

    return this.findById(id);
  }

  static async process(id) {
    return this.updateStatus(id, 'completed');
  }
}

module.exports = PaymentModel;
