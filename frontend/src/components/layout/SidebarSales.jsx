import React from 'react';
import { NavLink } from 'react-router-dom';

function SidebarSales() {
  // Đưa data menu của Kinh Doanh vào mảng
  const menuItems = [
    { path: '/khach-hang', icon: 'fa-users', label: 'Quản lý Khách hàng' },
    { path: '/tra-cuu-phong', icon: 'fa-bed', label: 'Tra cứu Phòng/Giường' },
  ];

  return (
    <div className="w-72 bg-blue-100 shadow-xl border-r border-gray-200 flex flex-col h-screen">
      {/* Header Sidebar */}
      <div className="p-6 border-b flex items-center gap-3">
        <i className="fas fa-home text-4xl text-blue-600"></i>
        <div>
          <h1 className="text-2xl text-gray-800 font-bold">HomeStay Dorm</h1>
          <p className="text-xs text-gray-500">Nhân viên Kinh doanh</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-4 rounded-2xl transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-500' // Trạng thái đang chọn
                  : 'text-gray-700 hover:bg-gray-100' // Trạng thái bình thường
              }`
            }
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
          {/* Avatar màu xanh dương cho Sale theo thiết kế gốc */}
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            NV
          </div>
          <div>
            <div className="font-medium">Nguyễn Văn Sale</div>
            <div className="text-xs text-green-600">Đang online</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarSales;