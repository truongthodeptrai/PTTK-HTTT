const { sql, pool } = require("../config/database");

class EmployeeModel {
  // GET - Lấy danh sách nhân viên
  static async getAllEmployees() {
    const db = await pool;
    const result = await db.request().query(`
      SELECT 
        nv.MaNhanVien,
        nv.TenNhanVien,
        tk.MaTaiKhoan,
        tk.TenTaiKhoan,
        nv.VaiTro,
        ISNULL(tk.TrangThaiHoatDong, 1) AS TrangThaiHoatDong
      FROM NhanVien nv
      LEFT JOIN TaiKhoan tk ON tk.MaNhanVien = nv.MaNhanVien
      ORDER BY nv.MaNhanVien DESC
    `);
    return result.recordset;
  }

  // POST - Tạo nhân viên mới
  static async createEmployee(data) {
    const { tenNhanVien, tenTaiKhoan, vaiTro, matKhauHash } = data;
    const db = await pool;

    try {
      // Bước 1: Thêm nhân viên vào bảng NhanVien
      const insertNhanVienResult = await db
        .request()
        .input("TenNhanVien", sql.NVarChar, tenNhanVien)
        .input("VaiTro", sql.NVarChar, vaiTro)
        .input("MaChiNhanh", sql.Int, 1).query(`
          INSERT INTO NhanVien (TenNhanVien, VaiTro, MaChiNhanh, CCCD, Luong, SDT)
          OUTPUT INSERTED.MaNhanVien
          VALUES (@TenNhanVien, @VaiTro, @MaChiNhanh, NULL, NULL, NULL);
        `);

      const maNhanVien = insertNhanVienResult.recordset[0]?.MaNhanVien;
      if (!maNhanVien) throw new Error("Không thể tạo nhân viên");

      // Bước 2: Thêm tài khoản vào bảng TaiKhoan
      const insertTaiKhoanResult = await db
        .request()
        .input("TenTaiKhoan", sql.NVarChar, tenTaiKhoan)
        .input("MatKhauHash", sql.NVarChar, matKhauHash)
        .input("MaNhanVien", sql.Int, maNhanVien).query(`
          INSERT INTO TaiKhoan (TenTaiKhoan, MatKhauHash, MaNhanVien, TrangThaiHoatDong)
          OUTPUT INSERTED.MaTaiKhoan, INSERTED.TenTaiKhoan, INSERTED.MaNhanVien, INSERTED.TrangThaiHoatDong
          VALUES (@TenTaiKhoan, @MatKhauHash, @MaNhanVien, 1);
        `);

      return {
        MaNhanVien: maNhanVien,
        TenNhanVien: tenNhanVien,
        TenTaiKhoan: tenTaiKhoan,
        VaiTro: vaiTro,
        TrangThaiHoatDong: true,
      };
    } catch (err) {
      throw new Error(`Lỗi tạo nhân viên: ${err.message}`);
    }
  }

  // PUT - Khóa/Mở khóa tài khoản
  static async toggleEmployeeStatus(id, trangThaiHoatDong) {
    const db = await pool;

    try {
      const result = await db
        .request()
        .input("MaNhanVien", sql.Int, id)
        .input("TrangThaiHoatDong", sql.Bit, trangThaiHoatDong ? 1 : 0).query(`
          UPDATE TaiKhoan
          SET TrangThaiHoatDong = @TrangThaiHoatDong
          WHERE MaNhanVien = @MaNhanVien;

          SELECT 
            nv.MaNhanVien,
            nv.TenNhanVien,
            tk.TenTaiKhoan,
            nv.VaiTro,
            tk.TrangThaiHoatDong
          FROM NhanVien nv
          LEFT JOIN TaiKhoan tk ON tk.MaNhanVien = nv.MaNhanVien
          WHERE nv.MaNhanVien = @MaNhanVien;
        `);

      return result.recordset[0];
    } catch (err) {
      throw new Error(`Lỗi thay đổi trạng thái: ${err.message}`);
    }
  }

  // PUT - Reset mật khẩu
  static async resetEmployeePassword(id, matKhauHash) {
    const db = await pool;

    try {
      const result = await db
        .request()
        .input("MaNhanVien", sql.Int, id)
        .input("MatKhauHash", sql.NVarChar, matKhauHash).query(`
          UPDATE TaiKhoan
          SET MatKhauHash = @MatKhauHash
          WHERE MaNhanVien = @MaNhanVien;

          SELECT 
            nv.MaNhanVien,
            nv.TenNhanVien,
            tk.TenTaiKhoan,
            nv.VaiTro,
            tk.TrangThaiHoatDong
          FROM NhanVien nv
          LEFT JOIN TaiKhoan tk ON tk.MaNhanVien = nv.MaNhanVien
          WHERE nv.MaNhanVien = @MaNhanVien;
        `);

      return result.recordset[0];
    } catch (err) {
      throw new Error(`Lỗi reset mật khẩu: ${err.message}`);
    }
  }

  static async findEmployeeByUserName(username) {
    const db = await pool;
    const result = await db.request().input("username", sql.NVarChar, username)
      .query(`
            SELECT nv.* FROM NhanVien nv
            INNER JOIN TaiKhoan tk ON nv.MaNhanVien = tk.MaNhanVien
            WHERE tk.TenTaiKhoan = @username
        `);
    return result.recordset[0] || null;
  }
}

module.exports = EmployeeModel;
