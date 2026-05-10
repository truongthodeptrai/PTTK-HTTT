const { sql, getPool } = require('../config/database');

function mapCustomer(row) {
  if (!row) return null;

  return {
    id: row.MaKhachHang,
    code: `KH${String(row.MaKhachHang).padStart(6, '0')}`,
    name: row.HoTen,
    cccd: row.CCCD,
    phone: row.SDT,
    gender: row.GioiTinh,
    nationality: row.QuocTich,
    email: row.Email,
    createdAt: row.NgayTao,
  };
}

class CustomerModel {
  static async findAll() {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT MaKhachHang, HoTen, CCCD, SDT, GioiTinh, QuocTich, Email, NgayTao
      FROM KhachHang
      ORDER BY MaKhachHang DESC
    `);

    return result.recordset.map(mapCustomer);
  }

  static async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT MaKhachHang, HoTen, CCCD, SDT, GioiTinh, QuocTich, Email, NgayTao
        FROM KhachHang
        WHERE MaKhachHang = @id
      `);

    return mapCustomer(result.recordset[0]);
  }

  static async create(customer) {
    const pool = await getPool();
    const result = await pool.request()
      .input('name', sql.NVarChar(200), customer.name)
      .input('cccd', sql.VarChar(12), customer.cccd)
      .input('phone', sql.VarChar(10), customer.phone)
      .input('gender', sql.VarChar(10), customer.gender || null)
      .input('nationality', sql.NVarChar(100), customer.nationality || 'Việt Nam')
      .input('email', sql.VarChar(200), customer.email || null)
      .query(`
        INSERT INTO KhachHang (HoTen, CCCD, SDT, GioiTinh, QuocTich, Email)
        OUTPUT INSERTED.MaKhachHang, INSERTED.HoTen, INSERTED.CCCD, INSERTED.SDT,
               INSERTED.GioiTinh, INSERTED.QuocTich, INSERTED.Email, INSERTED.NgayTao
        VALUES (@name, @cccd, @phone, @gender, @nationality, @email)
      `);

    return mapCustomer(result.recordset[0]);
  }

  static async update(id, customer) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar(200), customer.name)
      .input('cccd', sql.VarChar(12), customer.cccd)
      .input('phone', sql.VarChar(10), customer.phone)
      .input('gender', sql.VarChar(10), customer.gender || null)
      .input('nationality', sql.NVarChar(100), customer.nationality || 'Việt Nam')
      .input('email', sql.VarChar(200), customer.email || null)
      .query(`
        UPDATE KhachHang
        SET HoTen = @name,
            CCCD = @cccd,
            SDT = @phone,
            GioiTinh = @gender,
            QuocTich = @nationality,
            Email = @email
        OUTPUT INSERTED.MaKhachHang, INSERTED.HoTen, INSERTED.CCCD, INSERTED.SDT,
               INSERTED.GioiTinh, INSERTED.QuocTich, INSERTED.Email, INSERTED.NgayTao
        WHERE MaKhachHang = @id
      `);

    return mapCustomer(result.recordset[0]);
  }

  static async delete(id) {
    const customer = await this.findById(id);
    if (!customer) return null;

    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM KhachHang WHERE MaKhachHang = @id');

    return customer;
  }
}

module.exports = CustomerModel;
