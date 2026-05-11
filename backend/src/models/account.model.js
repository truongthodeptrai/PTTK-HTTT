class TaiKhoan {
    constructor(data) {
        this.MaTaiKhoan = data.MaTaiKhoan;
        this.TenTaiKhoan = data.TenTaiKhoan;
        this.MatKhauHash = data.MatKhauHash;
        this.MaNhanVien = data.MaNhanVien;
    }
}
module.exports = TaiKhoan;