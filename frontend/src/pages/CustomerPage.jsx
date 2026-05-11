import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Ẩn chừa lại 3 số cuối (Ví dụ: *******890)
const maskPhone = (phone) => {
  if (!phone) return "";
  if (phone.length <= 3) return phone;
  return "*".repeat(phone.length - 3) + phone.slice(-3);
};

// Ẩn đoạn giữa, hiện 3 số đầu và 3 số cuối (Ví dụ: 037******123)
const maskCCCD = (cccd) => {
  if (!cccd) return "";
  if (cccd.length <= 6) return cccd;
  return cccd.slice(0, 3) + "*".repeat(cccd.length - 6) + cccd.slice(-3);
};

// Ẩn giữa tên email (Ví dụ: ng***@gmail.com)
const maskEmail = (email) => {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return email; // Lỗi định dạng thì kệ nó
  if (user.length <= 2) return "*".repeat(user.length) + "@" + domain;
  return user.slice(0, 2) + "*".repeat(user.length - 2) + "@" + domain;
};
const PAGE_SIZE = 6;

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  // FIX LỖI: Dùng useCallback bọc hàm fetchCustomers và đưa ra ngoài
  // để cả useEffect và handleDelete đều có thể gọi được nó an toàn.
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/customers");

      if (!res.ok) {
        throw new Error(`Lỗi HTTP: ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        console.error("Dữ liệu không phải là mảng:", data);
        setCustomers([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // CRUD handlers
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // Red-500
      cancelButtonColor: "#6b7280", // Gray-500
      confirmButtonText: "Xóa khách hàng",
      cancelButtonText: "Hủy bỏ",
    });
    
    if (!result.isConfirmed) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCustomers(); // Bây giờ gọi hàm này sẽ không bị lỗi nữa
        Swal.fire({
          icon: "success",
          title: "Đã xóa khách hàng!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Xóa thất bại!",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (error) {
       Swal.fire({
          icon: "error",
          title: "Lỗi kết nối!",
          timer: 1800,
          showConfirmButton: false,
        });
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const kw = search.toLowerCase();
    return customers.filter((c) => {
      return (
        c.HoTen?.toLowerCase().includes(kw) ||
        c.CCCD?.toLowerCase().includes(kw) ||
        c.SDT?.toLowerCase().includes(kw) ||
        c.Email?.toLowerCase().includes(kw)
      );
    });
  }, [customers, search]);

  const currentList = useMemo(() => {
    return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  function renderPagination() {
    if (totalPages <= 1) return null;
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return (
      <div className="flex gap-1 mt-6 justify-center">
        <button
          className="px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          &lt; Trước
        </button>
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={"ellipsis-" + idx} className="px-2 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`px-3 py-1 rounded-md border transition-colors ${
                page === p
                  ? "bg-blue-600 border-blue-600 text-white font-medium"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          className="px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Sau &gt;
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Customer Management</h2>
        </div>
        
        <div className="mb-6 flex gap-3 items-center">
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              className="border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl w-72 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="Tìm kiếm khách hàng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-center text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">CCCD</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Nationality</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : currentList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-gray-400">
                    Không tìm thấy dữ liệu khách hàng nào
                  </td>
                </tr>
              ) : (
                currentList.map((c) => (
                  <tr key={c.MaKhachHang} className="hover:bg-blue-50/50 transition-colors text-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.MaKhachHang}</td>
                    <td className="px-4 py-3">{c.HoTen}</td>
                    <td className="px-4 py-3">{maskPhone(c.SDT)}</td>
                    <td className="px-4 py-3">{maskCCCD(c.CCCD)}</td>
                    <td className="px-4 py-3">{c.GioiTinh}</td>
                    <td className="px-4 py-3 text-gray-500">{c.QuocTich}</td>
                    <td className="px-4 py-3">{maskEmail(c.Email)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.TrangThaiLuuTru ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {c.TrangThaiLuuTru || "Chưa thuê"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {/* Nút Xem chi tiết */}
                        <Link
                          to={`/customers/${c.MaKhachHang}`}
                          state={{ TrangThaiLuuTru: c.TrangThaiLuuTru }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </Link>
                        
                        {/* Nút Chỉnh sửa */}
                        <Link
                          to={`/customers/${c.MaKhachHang}/edit`}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </Link>
                        
                        {/* Nút Xóa */}
                        <button
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Xóa"
                          onClick={() => handleDelete(c.MaKhachHang)}
                          disabled={actionLoading}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {renderPagination()}
      </div>

      {/* Nút Thêm Khách Hàng (Floating Action Button) */}
      <Link
        to="/customers/create"
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3.5 rounded-full shadow-lg shadow-blue-500/30 font-medium hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 z-40 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Thêm khách hàng
      </Link>
    </div>
  );
}

export default CustomerPage;