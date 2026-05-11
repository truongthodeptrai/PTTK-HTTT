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
}
module.exports = NhanVien;