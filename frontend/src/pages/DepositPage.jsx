import React, { useEffect, useState } from "react";

// Dữ liệu giả lập đặt cọc (có thể thay bằng fetch từ backend)
const mockDepositList = [
	{
		maDatCoc: 1,
		tenKhachHang: "Nguyễn Văn A",
		maPhong: "101",
		soTienCoc: 2000000,
		ngayDatCoc: "2024-05-01",
		hanThanhToan: "2024-05-10",
		trangThai: 0, // 0=Chờ thanh toán, 1=Đã thanh toán, 2=Hủy, 3=Hết hạn
		hinhThucThue: 1, // 1=Thuê giường, 2=Thuê nguyên phòng
		soGiuongDat: 2,
	},
	{
		maDatCoc: 2,
		tenKhachHang: "Trần Thị B",
		maPhong: "102",
		soTienCoc: 3000000,
		ngayDatCoc: "2024-05-03",
		hanThanhToan: "2024-05-12",
		trangThai: 1,
		hinhThucThue: 2,
		soGiuongDat: 0,
	},
];

const TRANG_THAI_LABELS = [
	"Chờ thanh toán",
	"Đã thanh toán",
	"Hủy",
	"Hết hạn",
];
const HINH_THUC_LABELS = ["", "Thuê giường", "Thuê nguyên phòng"];

function formatCurrency(num) {
	return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function DepositPage() {
	const [dsDatCoc, setDsDatCoc] = useState([]);
	const [tuKhoa, setTuKhoa] = useState("");

	useEffect(() => {
		// TODO: Thay bằng fetch từ backend
		setDsDatCoc(mockDepositList);
	}, []);

	// Lọc theo từ khóa (mã đặt cọc, tên khách, mã phòng)
	const dsDaLoc = dsDatCoc.filter((dc) => {
		const keyword = tuKhoa.toLowerCase();
		return (
			dc.maDatCoc.toString().includes(keyword) ||
			dc.tenKhachHang.toLowerCase().includes(keyword) ||
			dc.maPhong.toLowerCase().includes(keyword)
		);
	});

	return (
		<div className="p-6 bg-white rounded-xl shadow-md">
			<h2 className="text-2xl font-bold mb-4 text-blue-700">Quản lý Đặt cọc</h2>
			<div className="mb-4 flex gap-3 items-center">
				<input
					className="border px-3 py-2 rounded-lg w-64"
					placeholder="Tìm kiếm theo mã đặt cọc, khách, phòng..."
					value={tuKhoa}
					onChange={(e) => setTuKhoa(e.target.value)}
				/>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full border text-center">
					<thead className="bg-blue-100">
						<tr>
							<th className="px-3 py-2 border">Mã ĐC</th>
							<th className="px-3 py-2 border">Khách hàng</th>
							<th className="px-3 py-2 border">Phòng</th>
							<th className="px-3 py-2 border">Số tiền cọc</th>
							<th className="px-3 py-2 border">Ngày đặt</th>
							<th className="px-3 py-2 border">Hạn thanh toán</th>
							<th className="px-3 py-2 border">Trạng thái</th>
							<th className="px-3 py-2 border">Hình thức</th>
							<th className="px-3 py-2 border">Số giường đặt</th>
							<th className="px-3 py-2 border">Thao tác</th>
						</tr>
					</thead>
					<tbody>
						{dsDaLoc.length === 0 ? (
							<tr>
								<td colSpan={10} className="py-4 text-gray-400">Không có dữ liệu</td>
							</tr>
						) : (
							dsDaLoc.map((dc) => (
								<tr key={dc.maDatCoc} className="hover:bg-blue-50">
									<td className="border px-2 py-1">{dc.maDatCoc}</td>
									<td className="border px-2 py-1">{dc.tenKhachHang}</td>
									<td className="border px-2 py-1">{dc.maPhong}</td>
									<td className="border px-2 py-1">{formatCurrency(dc.soTienCoc)}</td>
									<td className="border px-2 py-1">{dc.ngayDatCoc}</td>
									<td className="border px-2 py-1">{dc.hanThanhToan}</td>
									<td className="border px-2 py-1">{TRANG_THAI_LABELS[dc.trangThai]}</td>
									<td className="border px-2 py-1">{HINH_THUC_LABELS[dc.hinhThucThue]}</td>
									<td className="border px-2 py-1">{dc.soGiuongDat}</td>
									<td className="border px-2 py-1">
										<button className="text-blue-600 hover:underline">Xem</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default DepositPage;
