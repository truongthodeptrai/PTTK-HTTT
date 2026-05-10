USE HomeStayDorm;
GO

-- Tạo chi nhánh
INSERT INTO ChiNhanh(TenChiNhanh,DiaChi)
VALUES(N'HomeStay Dorm Quận 7',N'25 Nguyễn Hữu Thọ, Phường Tân Hưng, Quận 7, TP Hồ Chí Minh')
GO

-- Tạo loại phòng
INSERT INTO LoaiPhong(TenLoaiPhong, SoNguoi)
VALUES
(N'Phòng 4 người',4),
(N'Phòng 6 người',6),
(N'Phòng 8 người',8)
GO

-- Tạo nhân viên
INSERT INTO NhanVien(TenNhanVien, CCCD, Luong, VaiTro, SDT, ChiTieu, NgayNhanChuc, MaChiNhanh)
VALUES
(N'Nguyễn Minh Quân', '079203001111', 25000000, 'manager', '0901111111', NULL, '2024-01-10', 1),
(N'Trần Quốc Huy','079203002222',18000000,'accountant','0902222222',100000000,NULL,1),
(N'Lê Hoàng Nam','079203003333',12000000,'sales','0903333333',NULL,NULL,1)
GO

-- Tạo tài khoản
-- Sales
EXEC SP_TaoTaiKhoan
    @TenTaiKhoan = 'sale01',
    @MatKhauHash = '$2b$10$dYklYvsvszSpRbMRZy4JP.6QMgPzMhIHCDQQm485b07pL4VH387SC',
    @MaNhanVien = 1
GO
-- Accountant
EXEC SP_TaoTaiKhoan
    @TenTaiKhoan = 'account01',
    @MatKhauHash = '$2b$10$dYklYvsvszSpRbMRZy4JP.6QMgPzMhIHCDQQm485b07pL4VH387SC',
    @MaNhanVien = 2
GO
-- Manager
EXEC SP_TaoTaiKhoan
    @TenTaiKhoan = 'manager01',
    @MatKhauHash = '$2b$10$dYklYvsvszSpRbMRZy4JP.6QMgPzMhIHCDQQm485b07pL4VH387SC',
    @MaNhanVien = 3
GO
GO

-- Sinh 160 phòng tự động
-- Xóa dữ liệu cũ nếu cần
DELETE FROM Phong;
GO

DECLARE @Khu CHAR(1)
DECLARE @Tang INT
DECLARE @SoPhong INT
DECLARE @TenPhong VARCHAR(10)
DECLARE @Loai INT

SET @Khu = 'A'

WHILE @Khu <= 'D'
BEGIN
    SET @Tang = 1
    WHILE @Tang <= 4
    BEGIN
        SET @SoPhong = 1
        WHILE @SoPhong <= 10
        BEGIN
            -- Ví dụ:
            -- A101 = Khu A tầng 1 phòng 01
            -- B210 = Khu B tầng 2 phòng 10
            SET @TenPhong =
                @Khu +
                CAST(@Tang AS VARCHAR) +
                RIGHT('00' + CAST(@SoPhong AS VARCHAR), 2)
            /*
                Quy tắc loại phòng mỗi tầng:
                Phòng 01-02 : loại 4 người
                Phòng 03-04 : loại 6 người
                Phòng 05-10 : loại 8 người
            */
            IF @SoPhong IN (1,2)
                SET @Loai = 1
            ELSE IF @SoPhong IN (3,4)
                SET @Loai = 2
            ELSE
                SET @Loai = 3

            INSERT INTO Phong
            (
                TenPhong,
                GiaNguyenPhong,
                GiaThueMotGiuong,
                SoNguoiToiDa,
                SoNguoiConLai,
                TrangThai,
                MaChiNhanh,
                MaLoaiPhong
            )
            VALUES
            (
                @TenPhong,
                -- Giá nguyên phòng
                CASE
                    WHEN @Loai = 1 THEN 12000000
                    WHEN @Loai = 2 THEN 15000000
                    ELSE 18000000
                END,
                -- Giá 1 giường
                CASE
                    WHEN @Loai = 1 THEN 3000000
                    WHEN @Loai = 2 THEN 2500000
                    ELSE 2250000
                END,
                -- Số người tối đa
                CASE
                    WHEN @Loai = 1 THEN 4
                    WHEN @Loai = 2 THEN 6
                    ELSE 8
                END,
                -- Ban đầu còn trống toàn bộ
                CASE
                    WHEN @Loai = 1 THEN 4
                    WHEN @Loai = 2 THEN 6
                    ELSE 8
                END,
                -- Trạng thái trống
                0,
                -- Chi nhánh
                1,
                -- Loại phòng
                @Loai
            )
            SET @SoPhong = @SoPhong + 1
        END
        SET @Tang = @Tang + 1
    END
    SET @Khu = CHAR(ASCII(@Khu) + 1)
END
GO



-- Dịch vụ mẫu
INSERT INTO DichVu (TenDichVu, PhiDichVu)
VALUES
(N'Giữ xe máy',150000),
(N'Wifi tốc độ cao',100000),
(N'Máy lạnh',300000),
(N'Giặt sấy',250000),
(N'Tủ lạnh mini',200000)
GO

-- Sinh 100 khách hàng thực tế Việt Nam
INSERT INTO KhachHang(HoTen, CCCD, SDT, GioiTinh, QuocTich, Email)
VALUES
(N'Nguyễn Văn An','079300000001','0910000001','Nam',N'Việt Nam','an01@gmail.com'),
(N'Trần Minh Đức','079300000002','0910000002','Nam',N'Việt Nam','duc02@gmail.com'),
(N'Lê Hoàng Long','079300000003','0910000003','Nam',N'Việt Nam','long03@gmail.com'),
(N'Phạm Gia Bảo','079300000004','0910000004','Nam',N'Việt Nam','bao04@gmail.com'),
(N'Võ Thành Công','079300000005','0910000005','Nam',N'Việt Nam','cong05@gmail.com'),
(N'Đặng Quốc Việt','079300000006','0910000006','Nam',N'Việt Nam','viet06@gmail.com'),
(N'Nguyễn Ngọc Huy','079300000007','0910000007','Nam',N'Việt Nam','huy07@gmail.com'),
(N'Bùi Thanh Tùng','079300000008','0910000008','Nam',N'Việt Nam','tung08@gmail.com'),
(N'Phan Minh Khang','079300000009','0910000009','Nam',N'Việt Nam','khang09@gmail.com'),
(N'Đỗ Anh Tú','079300000010','0910000010','Nam',N'Việt Nam','tu10@gmail.com')
GO

-- Dữ liệu yêu cầu thuê
EXEC SP_TaoYeuCauThue 2500000, '2026-06-01', 1, 12, 1, 3, 1

EXEC SP_TaoYeuCauThue 12000000, '2026-06-05', 2, 12, 4, 1, 2
GO

-- Dữ liệu đặt cọc
EXEC SP_DatCoc 1,1,1,1
EXEC SP_DatCoc 2,2,2,4
GO

-- Xác nhận cọc
EXEC SP_XacNhanDatCoc 1
EXEC SP_XacNhanDatCoc 2
GO

-- Tạo hợp đồng mẫu
EXEC SP_TaoHopDong '2026-06-01', '2027-06-01', 1, 2500000, 1, 1, 1, 1, 1
EXEC SP_TaoHopDong '2026-06-05', '2027-06-05', 1, 12000000, 2, 4, 2, 2, 2
GO

-- Dịch vụ hợp đồng
INSERT INTO DichVuHopDong
VALUES
(1,1,0),
(2,1,0),
(3,2,0)
GO

-- Thanh toán mẫu
INSERT INTO ThanhToan(SoTien, PhuongThuc, TrangThai, LoaiThanhToan, KyThanhToan, MaDatCoc, MaHopDong)
VALUES
(5000000, 2, 1, 'DAT_COC', NULL, 1, NULL),
(2500000,1, 1, 'TIEN_PHONG', 1, NULL, 1)
GO

-- Công nợ & phạt mẫu
INSERT INTO CongNoVaPhat(MaHopDong, LyDoPhat, PhiPhat)
VALUES (1, N'Làm mất chìa khóa', 300000)
GO

