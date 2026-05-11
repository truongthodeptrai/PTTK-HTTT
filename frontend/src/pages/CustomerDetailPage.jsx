import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [customer, setCustomer] = useState(location.state?.customerData || null);
  const [loading, setLoading] = useState(!location.state?.customerData);
  const navigate = useNavigate();
  const trangThaiLuuTruFromState = location.state?.TrangThaiLuuTru;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/customers/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) throw new Error("Không tìm thấy khách hàng");
        const data = await res.json();
        // Ưu tiên trạng thái truyền qua state nếu có
        setCustomer(trangThaiLuuTruFromState ? { ...data, TrangThaiLuuTru: trangThaiLuuTruFromState } : data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không tìm thấy thông tin khách hàng.",
          confirmButtonText: "Quay lại",
        }).then(() => navigate("/customer-management"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Nút điều hướng */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/customer-management")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách
          </button>
          <Link
            to={`/customers/${id}/edit`}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-emerald-700 transition-all flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Chỉnh sửa
          </Link>
        </div>

        {/* Thẻ thông tin chính */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-bold border border-white/30">
                {customer.HoTen?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{customer.HoTen}</h2>
                <p className="opacity-90 mt-1 flex items-center gap-2 text-sm">
                  <span className="px-2.5 py-1 bg-white/20 rounded-md">ID: {customer.MaKhachHang}</span>
                  <span>•</span>
                  <span>{customer.QuocTich || "Chưa cập nhật quốc tịch"}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-500 pl-3 mb-4">Thông tin định danh</h3>
              <InfoRow label="Giới tính" value={customer.GioiTinh} />
              <InfoRow label="CCCD / Passport" value={customer.CCCD} />
              <InfoRow label="Quốc tịch" value={customer.QuocTich} />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-l-4 border-emerald-500 pl-3 mb-4">Liên hệ & Trạng thái</h3>
              <InfoRow label="Số điện thoại" value={customer.SDT} />
              <InfoRow label="Email" value={customer.Email} />
              <div className="pt-2">
                <span className="text-sm text-gray-500 block mb-1">Trạng thái lưu trú</span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${customer.TrangThaiLuuTru ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {customer.TrangThaiLuuTru || 'Chưa có lịch thuê'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component con hỗ trợ hiển thị
function InfoRow({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-3">
      <span className="text-sm text-gray-500 block">{label}</span>
      <span className="font-medium text-gray-900">{value || "Không có dữ liệu"}</span>
    </div>
  );
}