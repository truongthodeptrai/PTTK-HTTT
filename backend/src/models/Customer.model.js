const { sql, pool } = require("../config/database");

class CustomerModel {
  static async getAllCustomersWithStatus() {
    const db = await pool;
    const result = await db.request().query(`
      SELECT k.*,
        CASE 
          WHEN EXISTS (SELECT 1 FROM HopDong h WHERE h.MaKhachHang = k.MaKhachHang AND h.TrangThai = 1) THEN N'Đang thuê'
          WHEN EXISTS (SELECT 1 FROM HopDong h WHERE h.MaKhachHang = k.MaKhachHang AND h.TrangThai = 0) THEN N'Chờ nhận phòng'
          WHEN EXISTS (SELECT 1 FROM DatCoc d WHERE d.MaKhachHang = k.MaKhachHang AND d.TrangThai = 0) THEN N'Chờ thanh toán cọc/hợp đồng'
          ELSE N'Chưa thuê' 
        END AS TrangThaiLuuTru
      FROM KhachHang k
    `);
    return result.recordset;
  }

  static async getCustomerById(id) {
    const db = await pool;
    const result = await db
      .request()
      .input("MaKhachHang", sql.Int, id)
      .query("SELECT * FROM KhachHang WHERE MaKhachHang = @MaKhachHang");
    return result.recordset[0];
  }

  static async createCustomer(data) {
    const db = await pool;
    const { HoTen, CCCD, SDT, GioiTinh, QuocTich, Email } = data;
    const result = await db
      .request()
      .input("HoTen", sql.NVarChar, HoTen)
      .input("CCCD", sql.VarChar, CCCD)
      .input("SDT", sql.VarChar, SDT)
      .input("GioiTinh", sql.VarChar, GioiTinh)
      .input("QuocTich", sql.NVarChar, QuocTich)
      .input("Email", sql.VarChar, Email).query(`
        INSERT INTO KhachHang (HoTen, CCCD, SDT, GioiTinh, QuocTich, Email)
        OUTPUT INSERTED.MaKhachHang, INSERTED.HoTen, INSERTED.CCCD, INSERTED.SDT, INSERTED.GioiTinh, INSERTED.QuocTich, INSERTED.Email, INSERTED.NgayTao
        VALUES (@HoTen, @CCCD, @SDT, @GioiTinh, @QuocTich, @Email)
      `);
    return result.recordset[0];
  }

  static async updateCustomer(id, data) {
    const db = await pool;
    const { HoTen, CCCD, SDT, GioiTinh, QuocTich, Email } = data;
    const result = await db
      .request()
      .input("MaKhachHang", sql.Int, id)
      .input("HoTen", sql.NVarChar, HoTen)
      .input("CCCD", sql.VarChar, CCCD)
      .input("SDT", sql.VarChar, SDT)
      .input("GioiTinh", sql.VarChar, GioiTinh)
      .input("QuocTich", sql.NVarChar, QuocTich)
      .input("Email", sql.VarChar, Email).query(`
        UPDATE KhachHang
        SET HoTen = @HoTen, CCCD = @CCCD, SDT = @SDT, GioiTinh = @GioiTinh, QuocTich = @QuocTich, Email = @Email
        OUTPUT INSERTED.MaKhachHang, INSERTED.HoTen, INSERTED.CCCD, INSERTED.SDT, INSERTED.GioiTinh, INSERTED.QuocTich, INSERTED.Email, INSERTED.NgayTao
        WHERE MaKhachHang = @MaKhachHang
      `);
    return result.recordset[0];
  }

  static async deleteCustomer(id) {
    const db = await pool;
    const result = await db.request().input("MaKhachHang", sql.Int, id).query(`
        DELETE FROM KhachHang WHERE MaKhachHang = @MaKhachHang
      `);
    return result.rowsAffected[0] > 0;
  }
}

module.exports = CustomerModel;
