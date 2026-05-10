const { sql, pool } = require('../config/database');

class AccountModel {
    static async createAccount(username, hashedPassword, MaNhanVien) {
        const db = await pool;
        const result = await db.request()
            .input('TenTaiKhoan', sql.NVarChar, username)
            .input('MatKhauHash', sql.NVarChar, hashedPassword)
            .input('MaNhanVien', sql.Int, MaNhanVien)
            .execute('SP_TaoTaiKhoan');
        return result;
    }

    static async findByUsername(username) {
        const db = await pool;
        const result = await db.request()
            .input('username', sql.NVarChar, username)
            .query(`
                SELECT
                    tk.MaTaiKhoan,
                    tk.TenTaiKhoan,
                    tk.MatKhauHash,
                    nv.MaNhanVien,
                    nv.TenNhanVien,
                    nv.VaiTro
                FROM TaiKhoan tk
                INNER JOIN NhanVien nv
                ON tk.MaNhanVien = nv.MaNhanVien
                WHERE tk.TenTaiKhoan = @username
            `);
        return result.recordset.length > 0 ? result.recordset[0] : null;
    }
}

module.exports = AccountModel;
