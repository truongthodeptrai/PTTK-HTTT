import React, { useEffect, useState } from "react";




function TrangQuanLyLuuTru() {
	const [dsHopDong, setDsHopDong] = useState([]);
	const [tuKhoa, setTuKhoa] = useState("");

	useEffect(() => {
		
	}, []);

	// Lọc theo từ khóa (mã hợp đồng, tên khách, mã phòng)
	const dsDaLoc = dsHopDong.filter((hd) => {
		const keyword = tuKhoa.toLowerCase();
		return (
			hd.maHopDong.toString().includes(keyword) ||
			hd.tenKhachHang.toLowerCase().includes(keyword) ||
			hd.maPhong.toLowerCase().includes(keyword)
		);
	});

	return (
		<div className="p-6 bg-white rounded-xl shadow-md">
			<h2 className="text-2xl font-bold mb-4 text-blue-700">Stay Management</h2>
			<div className="mb-4 flex gap-3 items-center">
				<input
					className="border px-3 py-2 rounded-lg w-64"
					placeholder="Tìm kiếm theo mã hợp đồng, khách, phòng..."
					value={tuKhoa}
					onChange={(e) => setTuKhoa(e.target.value)}
				/>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full border text-center">
					<thead className="bg-blue-100">
						<tr>
							<th className="px-3 py-2 border">Mã HĐ</th>
							<th className="px-3 py-2 border">Khách hàng</th>
							<th className="px-3 py-2 border">Phòng</th>
							<th className="px-3 py-2 border">Ngày bắt đầu</th>
							<th className="px-3 py-2 border">Ngày kết thúc</th>
							<th className="px-3 py-2 border">Trạng thái</th>
							<th className="px-3 py-2 border">Số giường thuê</th>
							<th className="px-3 py-2 border">Hình thức</th>
							<th className="px-3 py-2 border">Thao tác</th>
						</tr>
					</thead>
					<tbody>
						{dsDaLoc.length === 0 ? (
							<tr>
								<td colSpan={9} className="py-4 text-gray-400">Không có dữ liệu</td>
							</tr>
						) : (
							dsDaLoc.map((hd) => (
								<tr key={hd.maHopDong} className="hover:bg-blue-50">
									<td className="border px-2 py-1">{hd.maHopDong}</td>
									<td className="border px-2 py-1">{hd.tenKhachHang}</td>
									<td className="border px-2 py-1">{hd.maPhong}</td>
									<td className="border px-2 py-1">{hd.ngayBatDau}</td>
									<td className="border px-2 py-1">{hd.ngayKetThuc}</td>
									<td className="border px-2 py-1">{TRANG_THAI_LABELS[hd.trangThai]}</td>
									<td className="border px-2 py-1">{hd.soGiuongThue}</td>
									<td className="border px-2 py-1">{HINH_THUC_LABELS[hd.hinhThucThue]}</td>
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

export default TrangQuanLyLuuTru;
