const { sql, pool } = require('../config/database');

class NhanVienDB {
    static async findEmployeeByUserName(username) {
        const db = await pool;
        const result = await db.request()
            .input('username', sql.NVarChar, username)
            .query(`
                SELECT nv.* FROM NhanVien nv
                INNER JOIN TaiKhoan tk ON nv.MaNhanVien = tk.MaNhanVien
                WHERE tk.TenTaiKhoan = @username
            `);
        return result.recordset[0] || null;
    }
}
module.exports = NhanVienDB;