class NhanVien {
    constructor(data) {
        this.MaNhanVien = data.MaNhanVien;
        this.TenNhanVien = data.TenNhanVien;
        this.CCCD = data.CCCD;
        this.Luong = data.Luong;
        this.VaiTro = data.VaiTro;
        this.SDT = data.SDT;
        this.ChiTieu = data.ChiTieu;
        this.NgayNhanChuc = data.NgayNhanChuc;
        this.MaChiNhanh = data.MaChiNhanh;
    }
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
module.exports = NhanVien;