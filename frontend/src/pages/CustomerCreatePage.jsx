import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function CustomerCreatePage() {
  // Đã cập nhật state khớp với các cột trong SQL
  const [formData, setFormData] = useState({ 
    HoTen: "", 
    SDT: "", 
    CCCD: "", 
    GioiTinh: "Nam", // Mặc định là Nam để khớp CHECK constraint
    QuocTich: "Việt Nam", 
    Email: "" 
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đã thêm khách hàng mới.",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate("/customers");
        });
      } else {
        const errorData = await res.json();
        Swal.fire({
          icon: "error",
          title: "Thất bại!",
          text: errorData.message || "Không thể tạo khách hàng. Vui lòng kiểm tra lại CCCD hoặc SĐT (có thể bị trùng).",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: "Không thể kết nối đến máy chủ!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto mt-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8 border-b pb-4">
          <Link to="/customers" className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">
            Thêm khách hàng mới
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ Tên */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input 
                name="HoTen" 
                value={formData.HoTen} 
                onChange={handleChange} 
                required 
                placeholder="Nhập họ và tên đầy đủ"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
              />
            </div>

            {/* CCCD */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Số CCCD <span className="text-red-500">*</span>
              </label>
              <input 
                name="CCCD" 
                value={formData.CCCD} 
                onChange={handleChange} 
                required 
                maxLength={12}
                placeholder="Nhập 12 số CCCD"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input 
                name="SDT" 
                value={formData.SDT} 
                onChange={handleChange} 
                required 
                maxLength={10}
                placeholder="Nhập 10 số điện thoại"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
              />
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <select 
                name="GioiTinh" 
                value={formData.GioiTinh} 
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
              </select>
            </div>

            {/* Quốc tịch */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quốc tịch <span className="text-red-500">*</span>
              </label>
              <input 
                name="QuocTich" 
                value={formData.QuocTich} 
                onChange={handleChange} 
                required 
                placeholder="Ví dụ: Việt Nam"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email (Tùy chọn)
              </label>
              <input 
                name="Email" 
                type="email"
                value={formData.Email} 
                onChange={handleChange} 
                placeholder="example@gmail.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors" 
              onClick={() => navigate("/customer-management")}
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 transition-all flex items-center gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (
                "Lưu khách hàng"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}