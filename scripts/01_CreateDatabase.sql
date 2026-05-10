-- CREATE DATABASE HomeStayDorm;

USE HomeStayDorm;
GO

-- Chi nhánh 
CREATE TABLE ChiNhanh
(
    MaChiNhanh INT IDENTITY(1,1) PRIMARY KEY,
    TenChiNhanh NVARCHAR(200) NOT NULL,
    DiaChi NVARCHAR(500) NOT NULL,
    SDT VARCHAR(15),
    Email NVARCHAR(100)
);
GO

-- Nhân viên
CREATE TABLE NhanVien
(
    MaNhanVien INT IDENTITY(1,1) PRIMARY KEY,
    TenNhanVien NVARCHAR(200) NOT NULL,
    CCCD VARCHAR(12) UNIQUE NOT NULL,
    Luong INT NOT NULL CHECK(Luong > 0),
    VaiTro VARCHAR(20) NOT NULL CHECK(VaiTro IN ('accountant','manager','sales')),
    SDT VARCHAR(10) UNIQUE NOT NULL,
    ChiTieu INT NULL,
    NgayNhanChuc DATE NULL,
    MaChiNhanh INT NOT NULL,
    FOREIGN KEY(MaChiNhanh) REFERENCES ChiNhanh(MaChiNhanh),

    CONSTRAINT CK_NhanVien_Manager
    CHECK(
        (VaiTro = 'manager' AND NgayNhanChuc IS NOT NULL)
        OR
        (VaiTro <> 'manager' AND NgayNhanChuc IS NULL)
    ),

    CONSTRAINT CK_NhanVien_Accountant
    CHECK(
        (VaiTro = 'accountant' AND ChiTieu IS NOT NULL)
        OR
        (VaiTro <> 'accountant' AND ChiTieu IS NULL)
    )
);
GO

-- Tài khoản
CREATE TABLE TaiKhoan
(
    MaTaiKhoan INT IDENTITY(1,1) PRIMARY KEY,
    TenTaiKhoan NVARCHAR(100) UNIQUE NOT NULL,
    MatKhauHash NVARCHAR(255) NOT NULL,
    MaNhanVien INT UNIQUE NOT NULL,

    FOREIGN KEY(MaNhanVien) REFERENCES NhanVien(MaNhanVien)
)
GO

-- Loại phòng
CREATE TABLE LoaiPhong
(
    MaLoaiPhong INT IDENTITY(1,1) PRIMARY KEY,
    TenLoaiPhong NVARCHAR(100) NOT NULL,
    SoNguoi INT NOT NULL
);
GO

-- Phòng
CREATE TABLE Phong
(
    MaPhong INT IDENTITY(1,1) PRIMARY KEY,
    TenPhong NVARCHAR(20) UNIQUE NOT NULL,
    GiaNguyenPhong DECIMAL(19,4) NOT NULL,
    GiaThueMotGiuong DECIMAL(19,4) NOT NULL,
    SoNguoiToiDa INT NULL,
    SoNguoiConLai INT NULL,
    TrangThai INT NULL CHECK(TrangThai IN (0,1,2)), -- 0 = Trống, 1 = Đã đầy, 2 = Đang bảo trì
    MaChiNhanh INT NOT NULL,
    MaLoaiPhong INT NOT NULL,
    FOREIGN KEY(MaChiNhanh) REFERENCES ChiNhanh(MaChiNhanh),
    FOREIGN KEY(MaLoaiPhong) REFERENCES LoaiPhong(MaLoaiPhong)
);
GO


-- Khách hàng 
CREATE TABLE KhachHang
(
    MaKhachHang INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(200) NOT NULL,
    CCCD VARCHAR(12) UNIQUE NOT NULL,
    SDT VARCHAR(10) UNIQUE NOT NULL,
    GioiTinh VARCHAR(10) CHECK(GioiTinh IN ('Nam','Nu')),
    QuocTich NVARCHAR(100) NOT NULL,
    Email VARCHAR(200) NULL,
    NgayTao DATETIME DEFAULT GETDATE()
);
GO

-- Yêu cầu
CREATE TABLE YeuCau
(
    MaYeuCau INT IDENTITY(1,1) PRIMARY KEY,
    MucGia DECIMAL(19,4) NOT NULL,
    ThoiGianDuKien DATE NOT NULL,
    HinhThucThue INT NOT NULL CHECK(HinhThucThue IN (1,2)),
    ThoiHanThue INT NOT NULL,
    SoLuongNguoi INT NOT NULL,
    TrangThaiXetDuyet INT DEFAULT 0 CHECK(TrangThaiXetDuyet IN (0,1,2)), -- 0 = Chờ duyệt, 1 = Đã duyệt, 2 = Từ chối
    MaLoaiPhong INT NOT NULL,
    MaKhachHang INT NOT NULL,

    FOREIGN KEY(MaLoaiPhong) REFERENCES LoaiPhong(MaLoaiPhong),
    FOREIGN KEY(MaKhachHang) REFERENCES KhachHang(MaKhachHang)
);
GO

-- Dịch vụ
CREATE TABLE DichVu
(
    MaDichVu INT IDENTITY(1,1) PRIMARY KEY,
    TenDichVu NVARCHAR(200) NOT NULL,
    PhiDichVu DECIMAL(19,4) NOT NULL
);
GO

-- YeuCau_DichVu
CREATE TABLE YeuCau_DichVu
(
    MaYeuCau INT NOT NULL,
    MaDichVu INT NOT NULL,
    PRIMARY KEY(MaYeuCau, MaDichVu),
    FOREIGN KEY(MaYeuCau) REFERENCES YeuCau(MaYeuCau),
    FOREIGN KEY(MaDichVu) REFERENCES DichVu(MaDichVu)
);
GO

-- Nhóm thuê
CREATE TABLE NhomThue
(
    MaNhom INT IDENTITY(1,1) PRIMARY KEY,
    DaiDien INT NOT NULL,
    FOREIGN KEY(DaiDien) REFERENCES KhachHang(MaKhachHang)
);
GO

-- Danh sách thành viên
CREATE TABLE DanhSachThanhVien
(
    MaNhom INT NOT NULL,
    MaKhachHang INT NOT NULL,
    PRIMARY KEY(MaNhom, MaKhachHang),
    FOREIGN KEY(MaNhom) REFERENCES NhomThue(MaNhom),
    FOREIGN KEY(MaKhachHang) REFERENCES KhachHang(MaKhachHang)
);
GO

-- Đặt cọc
CREATE TABLE DatCoc
(
    MaDatCoc INT IDENTITY(1,1) PRIMARY KEY,
    SoTienCoc DECIMAL(19,4) NOT NULL,
    NgayDatCoc DATETIME DEFAULT GETDATE(),
    HanThanhToan DATETIME NOT NULL,
    TrangThai INT DEFAULT 0 CHECK(TrangThai IN (0,1,2,3)), -- 0 = Chờ thanh toán, 1 = Đã thanh toán, 2 = Hủy, 3 = Hết hạn
    HinhThucThue INT NOT NULL,
    SoGiuongDat INT NOT NULL,
    MaPhong INT NOT NULL,
    MaKhachHang INT NOT NULL,
    FOREIGN KEY(MaPhong) REFERENCES Phong(MaPhong),
    FOREIGN KEY(MaKhachHang) REFERENCES KhachHang(MaKhachHang)
);
GO

-- Hợp đồng 
CREATE TABLE HopDong
(
    MaHopDong INT IDENTITY(1,1) PRIMARY KEY,
    TrangThai INT DEFAULT 0 CHECK(TrangThai IN (0,1,2,3)), -- 0 = Chờ nhận phòng, 1 = Đang ở, 2 = Đã thanh lý, 3 = Hủy
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    ChuKyThanhToan INT NOT NULL,
    GiaMotChuKyThanhToan DECIMAL(19,4) NOT NULL,
    HinhThucThue INT NOT NULL CHECK(HinhThucThue IN (1,2)), -- 1 = Thuê giường, 2 = Thuê nguyên phòng
    SoGiuongThue INT NOT NULL,
    MaKhachHang INT NOT NULL,
    MaDatCoc INT NOT NULL,
    MaPhong INT NOT NULL,
    FOREIGN KEY(MaKhachHang) REFERENCES KhachHang(MaKhachHang),
    FOREIGN KEY(MaDatCoc) REFERENCES DatCoc(MaDatCoc),
    FOREIGN KEY(MaPhong) REFERENCES Phong(MaPhong)
);
GO

-- Dịch vụ hợp đồng
CREATE TABLE DichVuHopDong
(
    MaDichVu INT NOT NULL,
    MaHopDong INT NOT NULL,
    TrangThai INT DEFAULT 0 CHECK(TrangThai IN (0,1)),
    PRIMARY KEY(MaDichVu, MaHopDong),
    FOREIGN KEY(MaDichVu) REFERENCES DichVu(MaDichVu),
    FOREIGN KEY(MaHopDong) REFERENCES HopDong(MaHopDong)
);
GO

-- Thanh toán
CREATE TABLE ThanhToan
(
    MaThanhToan INT IDENTITY(1,1) PRIMARY KEY,
    SoTien DECIMAL(19,4) NOT NULL,
    PhuongThuc INT NOT NULL CHECK(PhuongThuc IN (1,2)),
    TrangThai INT NOT NULL CHECK(TrangThai IN (0,1)),
    LoaiThanhToan VARCHAR(50) NOT NULL,
    KyThanhToan INT NULL,
    MaDatCoc INT NULL,
    MaHopDong INT NULL,
    FOREIGN KEY(MaDatCoc) REFERENCES DatCoc(MaDatCoc),
    FOREIGN KEY(MaHopDong) REFERENCES HopDong(MaHopDong)
);
GO

-- Công nợ và phạt
CREATE TABLE CongNoVaPhat
(
    MaPhat INT IDENTITY(1,1) PRIMARY KEY,
    MaHopDong INT NOT NULL,
    LyDoPhat NVARCHAR(500) NOT NULL,
    PhiPhat DECIMAL(19,4) NOT NULL,
    FOREIGN KEY(MaHopDong) REFERENCES HopDong(MaHopDong)
);
GO