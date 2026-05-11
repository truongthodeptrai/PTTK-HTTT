import React, { useEffect, useState } from "react";
import AddDepositModal from "../components/AddDepositModal";

const TRANG_THAI_LABELS = {
	pending: "Chờ duyệt",
	approved: "Đã duyệt",
	rejected: "Từ chối",
	expired: "Đã hết hạn"
};

const HINH_THUC_LABELS = {
	  bed: "Theo giường",
  	  room: "Nguyên phòng",
}

function formatCurrency(num) {
	return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("vi-VN");
}

function DepositPage() {
	const [dsDatCoc, setDsDatCoc] = useState([]);
	const [tuKhoa, setTuKhoa] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchDeposits = async () => {
    let isMounted = true;

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/bookings");
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

    return () => {
      isMounted = false;
    };
  };

	useEffect(() => {
    fetchDeposits();
  }, []);

	// Lọc theo từ khóa (mã đặt cọc, tên khách, mã phòng)
	const dsDaLoc = dsDatCoc.filter((dc) => {
		const keyword = tuKhoa.toLowerCase();
		return (
			dc.code?.toLowerCase().includes(keyword) ||
			dc.customerName?.toLowerCase().includes(keyword) ||
			dc.roomName?.toLowerCase().includes(keyword)
		);
	});

	return (
		<div className="p-6 bg-white rounded-xl shadow-md">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold text-blue-700">Quản lý Đặt cọc</h2>
				<button
					onClick={() => setIsModalOpen(true)}
					className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
				>
					<i className="fas fa-plus"></i>
					Thêm Đặt cọc
				</button>
			</div>
			
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
					className="border px-3 py-2 rounded-lg flex-1"
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
							<th className="px-3 py-2 border">Số giường</th>
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
									<td className="border px-2 py-1 font-semibold">{formatCurrency(dc.amount)}</td>
									<td className="border px-2 py-1">{formatDate(dc.createdAt)}</td>
									<td className="border px-2 py-1">{formatDate(dc.paymentDeadline)}</td>
									<td className="border px-2 py-1">
										<span className={`px-2 py-1 rounded text-xs font-semibold ${
											dc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
											dc.status === 'approved' ? 'bg-green-100 text-green-800' :
											dc.status === 'rejected' ? 'bg-red-100 text-red-800' :
											'bg-gray-100 text-gray-800'
										}`}>
											{TRANG_THAI_LABELS[dc.status] || dc.status}
										</span>
									</td>
									<td className="border px-2 py-1">{HINH_THUC_LABELS[dc.rentalType] || "-"}</td>
									<td className="border px-2 py-1">{dc.bedCount || "-"}</td>
									<td className="border px-2 py-1">
										<button className="text-blue-600 hover:underline text-sm">Xem</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Add Deposit Modal */}
			<AddDepositModal 
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={fetchDeposits}
			/>
		</div>
	);
}

export default DepositPage;
