import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function SidebarAccountant() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const displayName = user.TenNhanVien || "Kế toán";

  const menuItems = [
    { path: 'deposit', icon: 'fa-money-bill-wave', label: 'Deposit Management' },
    { path: 'stay-management', icon: 'fa-file-contract', label: 'Stay Management' },
    // { path: 'thanh-toan-hoang-coc', icon: 'fa-hand-holding-usd', label: 'Thanh toán & Hoàn cọc' },
    // { path: 'cong-no-va-phat', icon: 'fa-exclamation-triangle', label: 'Công nợ & Phạt' },
  ];

  return (
    <div className="w-72 bg-blue-100 shadow-xl border-r border-gray-200 flex flex-col h-screen">
      {/* Header Sidebar */}
      <div className="p-6 border-b flex items-center gap-3">
        <i className="fas fa-home text-4xl text-blue-600"></i>
        <div>
          <h1 className="text-2xl text-gray-500 font-bold">HomeStay Dorm</h1>
          <p className="text-xs text-gray-500">Nhân viên Kế toán</p>
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
                  ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t space-y-3">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
            KT
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-medium text-sm text-gray-800 truncate">{displayName}</div>
            <div className="text-xs text-green-600">Đang online</div>
          </div>
        </div>

        {/* Nút Đăng xuất */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm border border-red-100"
        >
          <i className="fas fa-sign-out-alt"></i>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default SidebarAccountant;