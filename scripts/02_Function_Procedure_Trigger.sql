USE HomeStayDorm;
GO

-- Function bảo mật mật khẩu
CREATE FUNCTION FN_HashPassword
(
    @Password NVARCHAR(200),
    @Salt UNIQUEIDENTIFIER
)
RETURNS VARBINARY(256)
AS
BEGIN
    RETURN HASHBYTES
    (
        'SHA2_256',
        @Password + CAST(@Salt AS NVARCHAR(36))
    )
END
GO

CREATE PROCEDURE SP_TaoTaiKhoan
(
    @TenTaiKhoan NVARCHAR(100),
    @MatKhauHash NVARCHAR(255),
    @MaNhanVien INT
)

AS
BEGIN

    SET NOCOUNT ON;



    -- Kiểm tra username tồn tại

    IF EXISTS
    (
        SELECT 1
        FROM TaiKhoan
        WHERE TenTaiKhoan = @TenTaiKhoan
    )
    BEGIN

        RAISERROR(
            N'Tên tài khoản đã tồn tại',
            16,
            1
        )

        RETURN
    END



    -- Kiểm tra nhân viên tồn tại

    IF NOT EXISTS
    (
        SELECT 1
        FROM NhanVien
        WHERE MaNhanVien = @MaNhanVien
    )
    BEGIN

        RAISERROR(
            N'Nhân viên không tồn tại',
            16,
            1
        )

        RETURN
    END



    -- Kiểm tra nhân viên đã có tài khoản

    IF EXISTS
    (
        SELECT 1
        FROM TaiKhoan
        WHERE MaNhanVien = @MaNhanVien
    )
    BEGIN

        RAISERROR(
            N'Nhân viên đã có tài khoản',
            16,
            1
        )

        RETURN
    END



    INSERT INTO TaiKhoan
    (
        TenTaiKhoan,
        MatKhauHash,
        MaNhanVien
    )

    VALUES
    (
        @TenTaiKhoan,
        @MatKhauHash,
        @MaNhanVien
    )



    PRINT N'Tạo tài khoản thành công'

END
GO

-- Trigger cập nhật số giường còn lại
CREATE TRIGGER TR_CapNhatSoGiuong
ON HopDong
AFTER INSERT
AS
BEGIN
    UPDATE P
    SET
        SoNguoiConLai = SoNguoiConLai - I.SoGiuongThue
    FROM Phong P
    INNER JOIN inserted I
        ON P.MaPhong = I.MaPhong

    UPDATE Phong
    SET TrangThai =
        CASE
            WHEN SoNguoiConLai <= 0 THEN 1
            ELSE 0
        END
END
GO

-- Trigger trả phòng
CREATE TRIGGER TR_TraPhong
ON HopDong
AFTER UPDATE
AS
BEGIN

    IF UPDATE(TrangThai)
    BEGIN

        UPDATE P
        SET
            SoNguoiConLai = SoNguoiConLai + I.SoGiuongThue

        FROM Phong P
        INNER JOIN inserted I
            ON P.MaPhong = I.MaPhong

        INNER JOIN deleted D
            ON D.MaHopDong = I.MaHopDong

        WHERE I.TrangThai = 2
            AND D.TrangThai <> 2

    END

END
GO

-- Function tính tiền cọc
CREATE FUNCTION FN_TinhTienCoc
(
    @GiaGiuong DECIMAL(19,4),
    @SoGiuong INT
)
RETURNS DECIMAL(19,4)
AS
BEGIN

    RETURN (@GiaGiuong * 2) * @SoGiuong

END
GO

-- Procedure đặt cọc
CREATE PROCEDURE SP_DatCoc
(
    @MaPhong INT,
    @MaKhachHang INT,
    @HinhThucThue INT,
    @SoGiuongDat INT
)
AS
BEGIN

    DECLARE @Gia DECIMAL(19,4)

    SELECT @Gia = GiaThueMotGiuong
    FROM Phong
    WHERE MaPhong = @MaPhong

    DECLARE @TienCoc DECIMAL(19,4)

    SET @TienCoc = dbo.FN_TinhTienCoc(
        @Gia,
        @SoGiuongDat
    )

    INSERT INTO DatCoc
    (
        SoTienCoc,
        HanThanhToan,
        HinhThucThue,
        SoGiuongDat,
        MaPhong,
        MaKhachHang
    )
    VALUES
    (
        @TienCoc,
        DATEADD(HOUR, 24, GETDATE()),
        @HinhThucThue,
        @SoGiuongDat,
        @MaPhong,
        @MaKhachHang
    )

END
GO

-- Procedure xác nhận thanh toán cọc
CREATE PROCEDURE SP_XacNhanDatCoc
(
    @MaDatCoc INT
)
AS
BEGIN

    UPDATE DatCoc
    SET TrangThai = 1
    WHERE MaDatCoc = @MaDatCoc

END
GO

-- Procedure tạo hợp đồng
CREATE PROCEDURE SP_TaoHopDong
(
    @NgayBatDau DATE,
    @NgayKetThuc DATE,
    @ChuKyThanhToan INT,
    @GiaMotChuKyThanhToan DECIMAL(19,4),
    @HinhThucThue INT,
    @SoGiuongThue INT,
    @MaKhachHang INT,
    @MaDatCoc INT,
    @MaPhong INT
)
AS
BEGIN

    DECLARE @TrangThaiDatCoc INT

    SELECT @TrangThaiDatCoc = TrangThai
    FROM DatCoc
    WHERE MaDatCoc = @MaDatCoc

    IF @TrangThaiDatCoc <> 1
    BEGIN
        RAISERROR(N'Đặt cọc chưa được xác nhận',16,1)
        RETURN
    END

    INSERT INTO HopDong
    (
        NgayBatDau,
        NgayKetThuc,
        ChuKyThanhToan,
        GiaMotChuKyThanhToan,
        HinhThucThue,
        SoGiuongThue,
        MaKhachHang,
        MaDatCoc,
        MaPhong,
        TrangThai
    )
    VALUES
    (
        @NgayBatDau,
        @NgayKetThuc,
        @ChuKyThanhToan,
        @GiaMotChuKyThanhToan,
        @HinhThucThue,
        @SoGiuongThue,
        @MaKhachHang,
        @MaDatCoc,
        @MaPhong,
        1
    )

END
GO

-- Function tính hoàn cọc
CREATE FUNCTION FN_TinhHoanCoc
(
    @TienCoc DECIMAL(19,4),
    @SoThangDaO INT,
    @DaHetHan BIT,
    @DaKyHopDong BIT
)
RETURNS DECIMAL(19,4)
AS
BEGIN

    DECLARE @TienHoan DECIMAL(19,4)

    IF @DaKyHopDong = 0
        SET @TienHoan = @TienCoc * 0.8

    ELSE IF @DaHetHan = 1
        SET @TienHoan = @TienCoc

    ELSE IF @SoThangDaO < 6
        SET @TienHoan = @TienCoc * 0.5

    ELSE
        SET @TienHoan = @TienCoc * 0.7

    RETURN @TienHoan

END
GO

-- Procedure trả phòng
CREATE PROCEDURE SP_TraPhong
(
    @MaHopDong INT
)
AS
BEGIN

    UPDATE HopDong
    SET TrangThai = 2
    WHERE MaHopDong = @MaHopDong

END
GO