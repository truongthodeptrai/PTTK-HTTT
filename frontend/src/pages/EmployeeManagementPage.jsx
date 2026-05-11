import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: '',
    username: '',
    role: 'sales',
  });

  // Fetch danh sách nhân viên
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/employees', {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) throw new Error('Không thể tải danh sách nhân viên');
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Lọc danh sách theo tìm kiếm
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.TenNhanVien?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.TenTaiKhoan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý tạo tài khoản
  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!formData.hoTen || !formData.username || !formData.role) {
      Swal.fire({
        icon: 'warning',
        title: 'Cảnh báo!',
        text: 'Vui lòng nhập đầy đủ thông tin',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          tenNhanVien: formData.hoTen,
          tenTaiKhoan: formData.username,
          vaiTro: formData.role,
          matKhau: '123456',
        }),
      });

      if (!res.ok) throw new Error('Không thể tạo tài khoản');
      
      const responseBody = await res.json();
      const newEmployee = responseBody.data;

      setEmployees([...employees, newEmployee]);
      setShowModal(false);
      setFormData({ hoTen: '', username: '', role: 'sales' });

      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Tài khoản đã được cấp thành công',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message,
      });
    }
  };

 // Xử lý khóa/mở khóa tài khoản
  const handleToggleLock = async (empId, isActive) => {
    // Nếu đang hoạt động (isActive = true) -> Hành động sắp tới là 'khóa'
    const action = isActive ? 'khóa' : 'mở khóa';
    
    const result = await Swal.fire({
      icon: 'warning',
      title: `Xác nhận ${action} tài khoản?`,
      text: `Bạn chắc chắn muốn ${action} quyền truy cập của nhân viên này?`,
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
      confirmButtonColor: isActive ? '#d33' : '#3085d6', // Đổi màu nút cho hợp lý (Khóa thì màu đỏ)
      cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/employees/${empId}/toggle-status`, {
        method: 'PUT',
        headers: { 
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        // Gửi trạng thái mới xuống backend (đang true thì gửi false)
        body: JSON.stringify({ TrangThaiHoatDong: !isActive }), 
      });

      if (!res.ok) throw new Error(`Không thể ${action} tài khoản`);
      
      const updatedEmp = await res.json();

      // Cập nhật lại danh sách trên màn hình
      setEmployees(
        employees.map((emp) => (emp.MaNhanVien === empId ? updatedEmp : emp))
      );

      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: `Tài khoản đã được ${action} thành công.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message,
      });
    }
  };

  // Xử lý reset mật khẩu
  const handleResetPassword = async (empId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Reset mật khẩu?',
      text: 'Mật khẩu sẽ được đặt lại thành 123456. Bạn chắc chắn không?',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/employees/${empId}/reset-password`, {
        method: 'PUT',
        headers: { 
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });

      if (!res.ok) throw new Error('Không thể reset mật khẩu');

      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Mật khẩu đã được reset thành 123456',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: err.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý Nhân viên</h1>
          <p className="text-gray-600">Quản lý danh sách nhân viên và cấp tài khoản</p>
        </div>

        {/* Thanh tìm kiếm và nút tạo tài khoản */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Cấp tài khoản mới
          </button>
        </div>

        {/* Bảng danh sách */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Họ Tên</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Username</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vai Trò</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Không có nhân viên nào
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.MaNhanVien} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{emp.TenNhanVien}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.TenTaiKhoan}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {emp.VaiTro || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          emp.TrangThaiHoatDong
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {emp.TrangThaiHoatDong ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-3 justify-center">
                        {/* Nút Khóa/Mở */}
                        <button
                          onClick={() => handleToggleLock(emp.MaNhanVien, emp.TrangThaiHoatDong)}
                          className={`p-2 rounded-lg transition-colors ${
                            emp.TrangThaiHoatDong
                              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                          title={emp.TrangThaiHoatDong ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={
                                emp.TrangThaiHoatDong
                                  ? 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm6-10V7a3 3 0 00-3-3H9a3 3 0 00-3 3v2h12z'
                                  : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                              }
                            />
                          </svg>
                        </button>

                        {/* Nút Reset Password */}
                        <button
                          onClick={() => handleResetPassword(emp.MaNhanVien)}
                          className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors"
                          title="Reset mật khẩu"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
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
      </div>

      {/* Modal tạo tài khoản */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Cấp tài khoản mới</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-6 space-y-4">
              {/* Họ Tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ Tên</label>
                <input
                  type="text"
                  value={formData.hoTen}
                  onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Nhập họ tên"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Nhập username"
                />
              </div>

              {/* Vai Trò */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai Trò</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="sales">Kinh doanh (SALE)</option>
                  <option value="accountant">Kế toán (ACCOUNTANT)</option>
                  <option value="manager">Quản lý (MANAGER)</option>
                </select>
              </div>

              {/* Thông báo mật khẩu mặc định */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Mật khẩu mặc định:</span> 123456
                </p>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Cấp tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
