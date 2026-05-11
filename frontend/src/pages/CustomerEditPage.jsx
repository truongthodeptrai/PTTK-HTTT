import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function CustomerEditPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({ 
    HoTen: "", SDT: "", CCCD: "", GioiTinh: "Nam", QuocTich: "", Email: "" 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
        // Lọc bỏ các trường dư thừa không cần update
        setFormData({
          HoTen: data.HoTen || "",
          SDT: data.SDT || "",
          CCCD: data.CCCD || "",
          GioiTinh: data.GioiTinh || "Nam",
          QuocTich: data.QuocTich || "",
          Email: data.Email || ""
        });
      } catch (err) {
        Swal.fire({
          icon: "error", title: "Lỗi", text: "Không tìm thấy khách hàng!"
        }).then(() => navigate("/customer-management"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        Swal.fire({
          icon: "success", title: "Thành công!", text: "Đã cập nhật khách hàng.", timer: 1500, showConfirmButton: false
        }).then(() => navigate("/customer-management"));
      } else {
        Swal.fire({ icon: "error", title: "Thất bại", text: "CCCD hoặc SĐT có thể bị trùng." });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Lỗi kết nối", text: "Không thể kết nối đến máy chủ." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto mt-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8 border-b pb-4">
          <Link to="/customer-management" className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa khách hàng</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
              <input name="HoTen" value={formData.HoTen} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số CCCD <span className="text-red-500">*</span></label>
              <input name="CCCD" value={formData.CCCD} onChange={handleChange} required maxLength={12} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
              <input name="SDT" value={formData.SDT} onChange={handleChange} required maxLength={10} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Giới tính <span className="text-red-500">*</span></label>
              <select name="GioiTinh" value={formData.GioiTinh} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white">
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quốc tịch <span className="text-red-500">*</span></label>
              <input name="QuocTich" value={formData.QuocTich} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input name="Email" type="email" value={formData.Email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button type="button" className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors" onClick={() => navigate("/customer-management")}>
              Hủy bỏ
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
              {saving ? "Đang lưu..." : "Cập nhật thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}