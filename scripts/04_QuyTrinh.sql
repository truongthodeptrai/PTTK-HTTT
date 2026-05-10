USE HomeStayDorm;
GO

-- Bước 1: Khách tạo yêu cầu
EXEC SP_TaoYeuCauThue 2000000, '2026-07-01', 1, 6, 1, 3, 5

-- Bước 2: Sale tạo đặt cọc
EXEC SP_DatCoc 10, 5, 1, 1

-- Bước 3: Kế toán xác nhận thanh toán cọc
EXEC SP_XacNhanDatCoc 3

-- Bước 4: Tạo hợp đồng
EXEC SP_TaoHopDong '2026-07-01', '2027-01-01', 1, 2250000, 1, 1, 5, 3, 10

-- Bước 5: Thanh toán tiền phòng
INSERT INTO ThanhToan(SoTien, PhuongThuc, TrangThai, LoaiThanhToan, KyThanhToan, MaHopDong)
VALUES (2250000, 2, 1, 'TIEN_PHONG', 1, 3)

-- Bước 6: Trả phòng
EXEC SP_TraPhong 3