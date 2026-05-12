-- Script: Cập nhật schema NhanVien để hỗ trợ tạo nhân viên không có CCCD/SDT/Luong
-- Ngày: 2026-05-11

USE HomeStayDorm;
GO

-- Bước 1: Drop constraint cũ
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'NhanVien' AND CONSTRAINT_NAME = 'CK_NhanVien_Manager')
BEGIN
    ALTER TABLE NhanVien DROP CONSTRAINT CK_NhanVien_Manager;
END
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'NhanVien' AND CONSTRAINT_NAME = 'CK_NhanVien_Accountant')
BEGIN
    ALTER TABLE NhanVien DROP CONSTRAINT CK_NhanVien_Accountant;
END
GO

-- Bước 2: Tạo unique key tạm thời nếu CCCD đang là unique
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'NhanVien' AND CONSTRAINT_NAME LIKE 'UQ_NhanVien_%')
BEGIN
    DECLARE @ConstraintName NVARCHAR(128);
    SELECT TOP 1 @ConstraintName = CONSTRAINT_NAME 
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_NAME = 'NhanVien' AND CONSTRAINT_TYPE = 'UNIQUE' AND CONSTRAINT_NAME NOT LIKE 'PK_%';
    
    IF @ConstraintName IS NOT NULL
    BEGIN
        EXEC ('ALTER TABLE NhanVien DROP CONSTRAINT ' + @ConstraintName);
    END
END
GO

-- Bước 3: Cho phép CCCD NULL (tạm)
BEGIN TRY
    ALTER TABLE NhanVien ALTER COLUMN CCCD VARCHAR(12) NULL;
    PRINT 'CCCD updated to NULL';
END TRY
BEGIN CATCH
    PRINT 'CCCD update skipped or already NULL';
END CATCH
GO

-- Bước 4: Cho phép Luong NULL (tạm)
BEGIN TRY
    ALTER TABLE NhanVien DROP CONSTRAINT CK_NhanVien_Luong;
END TRY
BEGIN CATCH
    PRINT 'Check constraint not found, skipping';
END CATCH
GO

BEGIN TRY
    ALTER TABLE NhanVien ALTER COLUMN Luong INT NULL;
    PRINT 'Luong updated to NULL';
END TRY
BEGIN CATCH
    PRINT 'Luong update skipped or already NULL';
END CATCH
GO

-- Bước 5: Cho phép SDT NULL (tạm)
BEGIN TRY
    -- Drop unique constraint trên SDT nếu có
    DECLARE @SDTConstraint NVARCHAR(128);
    SELECT TOP 1 @SDTConstraint = TC.CONSTRAINT_NAME 
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS TC
    INNER JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE CCU 
        ON TC.CONSTRAINT_NAME = CCU.CONSTRAINT_NAME
    WHERE TC.TABLE_NAME = 'NhanVien' 
        AND TC.CONSTRAINT_TYPE = 'UNIQUE' 
        AND CCU.COLUMN_NAME = 'SDT';
    
    IF @SDTConstraint IS NOT NULL
    BEGIN
        EXEC ('ALTER TABLE NhanVien DROP CONSTRAINT ' + @SDTConstraint);
        PRINT 'Dropped SDT unique constraint: ' + @SDTConstraint;
    END
    ELSE
    BEGIN
        PRINT 'No SDT unique constraint found';
    END
END TRY
BEGIN CATCH
    PRINT 'SDT constraint drop error: ' + ERROR_MESSAGE();
END CATCH
GO

BEGIN TRY
    ALTER TABLE NhanVien ALTER COLUMN SDT VARCHAR(10) NULL;
    PRINT 'SDT updated to NULL';
END TRY
BEGIN CATCH
    PRINT 'SDT update skipped or already NULL: ' + ERROR_MESSAGE();
END CATCH
GO

-- Bước 6: Tạo lại check constraints nếu cần
BEGIN TRY
    ALTER TABLE NhanVien
    ADD CONSTRAINT CK_NhanVien_Manager
    CHECK(
        (VaiTro = 'manager' AND NgayNhanChuc IS NOT NULL)
        OR
        (VaiTro <> 'manager' AND NgayNhanChuc IS NULL)
    );
END TRY
BEGIN CATCH
    PRINT 'Manager constraint skipped';
END CATCH
GO

BEGIN TRY
    ALTER TABLE NhanVien
    ADD CONSTRAINT CK_NhanVien_Accountant
    CHECK(
        (VaiTro = 'accountant' AND ChiTieu IS NOT NULL)
        OR
        (VaiTro <> 'accountant' AND ChiTieu IS NULL)
    );
END TRY
BEGIN CATCH
    PRINT 'Accountant constraint skipped';
END CATCH
GO

PRINT 'Schema update hoàn tất!';
GO
