-- Migration: Thêm cột TrangThaiHoatDong vào bảng TaiKhoan
-- Ngày: 2026-05-11

USE HomeStayDorm;
GO

-- Kiểm tra xem cột TrangThaiHoatDong đã tồn tại chưa
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'TaiKhoan' AND COLUMN_NAME = 'TrangThaiHoatDong')
BEGIN
    -- Thêm cột TrangThaiHoatDong với giá trị mặc định là 1 (Hoạt động)
    ALTER TABLE TaiKhoan
    ADD TrangThaiHoatDong BIT DEFAULT 1 NOT NULL;
    
    PRINT 'Cột TrangThaiHoatDong đã được thêm vào bảng TaiKhoan';
END
ELSE
BEGIN
    PRINT 'Cột TrangThaiHoatDong đã tồn tại trong bảng TaiKhoan';
END
GO

-- Cập nhật constraints trên bảng NhanVien để cho phép NULL cho CCCD, Luong, SDT
-- (Nếu cần thì uncomment các dòng dưới)
-- ALTER TABLE NhanVien DROP CONSTRAINT CK_NhanVien_Manager;
-- ALTER TABLE NhanVien DROP CONSTRAINT CK_NhanVien_Accountant;
-- ALTER TABLE NhanVien ALTER COLUMN CCCD VARCHAR(12) NULL;
-- ALTER TABLE NhanVien ALTER COLUMN Luong INT NULL;
-- ALTER TABLE NhanVien ALTER COLUMN SDT VARCHAR(10) NULL;

PRINT 'Migration hoàn tất!';
GO
