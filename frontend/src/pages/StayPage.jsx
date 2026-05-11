import { useEffect, useMemo, useState } from "react";

const STATUS_LABELS = {
  pending_checkin: "Chờ nhận phòng",
  active: "Đang ở",
  completed: "Đã thanh lý",
  cancelled: "Đã huỷ"
};

const RENTAL_TYPE_LABELS = {
  bed: "Theo giường",
  room: "Nguyên phòng",
};

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("vi-VN");
}

function getRentalTypeLabel(value) {
  if (value === null || value === undefined || value === "") return "-";
  return RENTAL_TYPE_LABELS[value] || String(value);
}

function TrangQuanLyLuuTru() {
  const [stays, setStays] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  //Fetch data từ API
  useEffect(() => {
    // let isMounted = true;

    // async function fetchStays() {
    //   try {
    //     setIsLoading(true);
    //     setError("");

    //     const response = await fetch("http://localhost:5000/api/stays");
    //     if (!response.ok) {
    //       throw new Error("Khong the tai danh sach luu tru");
    //     }

    //     const data = await response.json();
    //     const stayList = Array.isArray(data) ? data : data.data || [];

    //     if (isMounted) {
    //       setStays(stayList);
    //     }
    //   } catch (err) {
    //     if (isMounted) {
    //       setError(err.message || "Khong the tai danh sach luu tru");
    //       setStays([]);
    //     }
    //   } finally {
    //     if (isMounted) {
    //       setIsLoading(false);
    //     }
    //   }
    // }

    // fetchStays();

    // return () => {
    //   isMounted = false;
    // };
  }, []);

  const filteredList = useMemo(() => {
    const searchText = keyword.trim().toLowerCase();
    if (!searchText) return stays;

    return stays.filter((stay) =>
      [
        stay.code,
        stay.customerName,
        stay.gender,
        stay.nationality,
        stay.idNumber,
        stay.roomId,
        stay.roomName,
        stay.checkIn,
        stay.checkOut,
        STATUS_LABELS[stay.status],
        stay.status,
        stay.bedCount,
        getRentalTypeLabel(stay.rentalType),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchText)),
    );
  }, [keyword, stays]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Stay Management</h2>

      <div className="mb-4 flex gap-3 items-center">
        <input
          className="border px-3 py-2 rounded-lg w-64"
          placeholder="Tìm theo hợp đồng, khách, phòng..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border text-center">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-3 py-2 border">Mã Hợp Đồng</th>
              <th className="px-3 py-2 border">Tên Khách Hàng</th>
              <th className="px-3 py-2 border">Giới tính</th>
              <th className="px-3 py-2 border">Quốc tịch</th>
              <th className="px-3 py-2 border">Số CCCD/Hộ Chiếu</th>
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
            {isLoading ? (
              <tr>
                <td colSpan={12} className="py-4 text-gray-400">
                  Đang tải dữ liệu
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-4 text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filteredList.map((stay) => (
                <tr key={stay.id || stay.code} className="hover:bg-blue-50">
                  <td className="border px-2 py-1">{stay.code}</td>
                  <td className="border px-2 py-1">{stay.customerName || "-"}</td>
                  <td className="border px-2 py-1">{stay.gender === 'Nam'? 'Nam' : 'Nữ'}</td>
                  <td className="border px-2 py-1">{stay.nationality || "-"}</td>
                  <td className="border px-2 py-1">{stay.idNumber || "-"}</td>
                  <td className="border px-2 py-1">{stay.roomName || stay.roomId || "-"}</td>
                  <td className="border px-2 py-1">{formatDate(stay.checkIn)}</td>
                  <td className="border px-2 py-1">{formatDate(stay.checkOut)}</td>
                  <td className="border px-2 py-1">{STATUS_LABELS[stay.status] || stay.status || "-"}</td>
                  <td className="border px-2 py-1">{stay.bedCount ?? "-"}</td>
                  <td className="border px-2 py-1">{getRentalTypeLabel(stay.rentalType)}</td>
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
