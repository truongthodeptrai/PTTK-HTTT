import React, { useEffect, useState } from "react";

// Dữ liệu giả lập đặt cọc (có thể thay bằng fetch từ backend)
const mockDepositList = [
	// {
	// 	id: 1,
	// 	customerName: "Nguyễn Văn A",
	// 	roomId: "101",
	// 	amount: 2000000,
	// 	createdAt: "2024-05-01",
	// 	paymentDeadline: "2024-05-10",
	// 	status: 0, // 0=Chờ thanh toán, 1=Đã thanh toán, 2=Hủy, 3=Hết hạn
	// 	rentalType: 1, // 1=Thuê giường, 2=Thuê nguyên phòng
	// 	bedCount: 2,
	// },
	// {
	// 	id: 2,
	// 	customerName: "Trần Thị B",
	// 	roomId: "102",
	// 	amount: 3000000,
	// 	createdAt: "2024-05-03",
	// 	paymentDeadline: "2024-05-12",
	// 	paymentStatus: 1,
	// 	rentalType: 2,
	// 	bedCount: 0,
	// },
];

const TRANG_THAI_LABELS = {
	pending_checkin: "Chờ thanh toán",
	active: "Đã thanh toán",
	completed: "Đã huỷ",
	cancelled: "Đã hết hạn"
};

const HINH_THUC_LABELS = {
	  bed: "Theo giường",
  	  room: "Nguyên phòng",
}

function formatCurrency(num) {
	return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function DepositPage() {
	const [dsDatCoc, setDsDatCoc] = useState([]);
	const [tuKhoa, setTuKhoa] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
    let isMounted = true;

    async function fetchDeposits() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/stays");
        if (!response.ok) {
          throw new Error("Không thể tải danh sách đặt cọc");
        }

        const data = await response.json();
        const depositList = Array.isArray(data) ? data : data.data || [];

        if (isMounted) {
          setDsDatCoc(depositList);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Không thể tải danh sách đặt cọc");
          setDsDatCoc([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDeposits();

    return () => {
      isMounted = false;
    };
  }, []);

	// Lọc theo từ khóa (mã đặt cọc, tên khách, mã phòng)
	const dsDaLoc = dsDatCoc.filter((dc) => {
		const keyword = tuKhoa.toLowerCase();
		return (
			dc.code?.toLowerCase().includes(keyword) ||
			dc.customerName?.toLowerCase().includes(keyword) ||
			dc.roomId?.toLowerCase().includes(keyword)
		);
	});

	return (
		<div className="p-6 bg-white rounded-xl shadow-md">
			<h2 className="text-2xl font-bold mb-4 text-blue-700">Quản lý Đặt cọc</h2>
			
			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
					{error}
				</div>
			)}

			{isLoading && (
				<div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
					Đang tải dữ liệu...
				</div>
			)}

			<div className="mb-4 flex gap-3 items-center">
				<input
					className="border px-3 py-2 rounded-lg w-64"
					placeholder="Tìm kiếm theo mã đặt cọc, khách, phòng..."
					value={tuKhoa}
					onChange={(e) => setTuKhoa(e.target.value)}
				/>
			</div>
				<table className="min-w-full border text-center">
					<thead className="bg-blue-100">
						<tr>
							<th className="px-3 py-2 border">Mã HD</th>
							<th className="px-3 py-2 border">Khách hàng</th>
							<th className="px-3 py-2 border">Phòng</th>
							<th className="px-3 py-2 border">Ngày vào</th>
							<th className="px-3 py-2 border">Ngày ra</th>
							<th className="px-3 py-2 border">Trạng thái</th>
							<th className="px-3 py-2 border">Hình thức</th>
							<th className="px-3 py-2 border">Số giường</th>
							<th className="px-3 py-2 border">Giá/Kỳ</th>
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
								<tr key={dc.id} className="hover:bg-blue-50">
									<td className="border px-2 py-1">{dc.code}</td>
									<td className="border px-2 py-1">{dc.customerName}</td>
									<td className="border px-2 py-1">{dc.roomName}</td>
									<td className="border px-2 py-1">{dc.checkIn}</td>
									<td className="border px-2 py-1">{dc.checkOut}</td>
									<td className="border px-2 py-1">{TRANG_THAI_LABELS[dc.status]}</td>
									<td className="border px-2 py-1">{HINH_THUC_LABELS[dc.rentalType]}</td>
									<td className="border px-2 py-1">{dc.bedCount || "-"}</td>
									<td className="border px-2 py-1">{formatCurrency(dc.monthlyFee)}</td>
									<td className="border px-2 py-1">
										<button className="text-blue-600 hover:underline">Xem</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
		</div>
	);
}

export default DepositPage;
