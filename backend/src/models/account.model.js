const { sql, pool } = require("../config/database");

class accountModel {
  static async findAccountByUsername(username) {
    if (typeof username === "undefined" || username === null) {
      console.error("LỖI: Biến username truyền vào TaiKhoanDB bị UNDEFINED!");
      throw new Error("Tham số username không hợp lệ");
    }
    const db = await pool;
    const result = await db
      .request()
      .input("username", sql.NVarChar, username)
      .query("SELECT * FROM TaiKhoan WHERE TenTaiKhoan = @username");
    return result.recordset[0] || null;
  }

  static async save(username, hashedPassword, MaNhanVien) {
    const db = await pool;
    return await db
      .request()
      .input("TenTaiKhoan", sql.NVarChar, username)
      .input("MatKhauHash", sql.NVarChar, hashedPassword)
      .input("MaNhanVien", sql.Int, MaNhanVien)
      .execute("SP_TaoTaiKhoan");
  }
}
module.exports = accountModel;
