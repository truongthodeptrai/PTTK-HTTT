const { sql, getPool } = require('../config/database');

function mapUser(row) {
  if (!row) return null;

  return {
    id: row.MaNhanVien,
    accountId: row.MaTaiKhoan,
    username: row.TenTaiKhoan,
    passwordHash: row.MatKhauHash,
    role: row.VaiTro,
    name: row.TenNhanVien,
    cccd: row.CCCD,
    salary: row.Luong,
    phone: row.SDT,
    target: row.ChiTieu,
    startDate: row.NgayNhanChuc,
    branchId: row.MaChiNhanh,
    branchName: row.TenChiNhanh,
  };
}

class UserModel {
  static async findByUsername(username) {
    const pool = await getPool();
    const result = await pool.request()
      .input('username', sql.NVarChar(100), username)
      .query(`
        SELECT tk.MaTaiKhoan, tk.TenTaiKhoan, tk.MatKhauHash,
               nv.MaNhanVien, nv.TenNhanVien, nv.CCCD, nv.Luong,
               nv.VaiTro, nv.SDT, nv.ChiTieu, nv.NgayNhanChuc,
               nv.MaChiNhanh, cn.TenChiNhanh
        FROM TaiKhoan tk
        INNER JOIN NhanVien nv ON nv.MaNhanVien = tk.MaNhanVien
        INNER JOIN ChiNhanh cn ON cn.MaChiNhanh = nv.MaChiNhanh
        WHERE tk.TenTaiKhoan = @username
      `);

    return mapUser(result.recordset[0]);
  }

  static async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT tk.MaTaiKhoan, tk.TenTaiKhoan, tk.MatKhauHash,
               nv.MaNhanVien, nv.TenNhanVien, nv.CCCD, nv.Luong,
               nv.VaiTro, nv.SDT, nv.ChiTieu, nv.NgayNhanChuc,
               nv.MaChiNhanh, cn.TenChiNhanh
        FROM TaiKhoan tk
        INNER JOIN NhanVien nv ON nv.MaNhanVien = tk.MaNhanVien
        INNER JOIN ChiNhanh cn ON cn.MaChiNhanh = nv.MaChiNhanh
        WHERE nv.MaNhanVien = @id
      `);

    return mapUser(result.recordset[0]);
  }
}

module.exports = UserModel;
