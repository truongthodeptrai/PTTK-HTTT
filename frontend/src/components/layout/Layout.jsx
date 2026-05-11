import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import SidebarAccountant from './SidebarAccountant';
import SidebarSales from './SidebarSales';
import SidebarManager from './SidebarManager';

function Layout({ userRole }) {
  const navigate = useNavigate();
  
  // Hàm đăng xuất dùng chung
  const handleLogout = () => {
    sessionStorage.clear(); // Xóa sạch token và user info
    navigate('/'); // Đẩy về trang login
  };

  let SidebarComponent;
  if (userRole === 'accountant') SidebarComponent = SidebarAccountant;
  if (userRole === 'sales') SidebarComponent = SidebarSales; 
  if (userRole === 'manager') SidebarComponent = SidebarManager;

  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const displayName = user.TenNhanVien || userRole; 

  if (!SidebarComponent) return null;

  return (
    <div className="flex min-h-screen bg-[#f6f8fa]">
      {/* Truyền hàm logout xuống Sidebar dưới dạng prop */}
      <SidebarComponent onLogout={handleLogout} />
      
      <div className="flex flex-col flex-1 min-w-0">
        <header className="px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-300 text-white border-b-2 border-blue-800 font-semibold flex justify-between items-center">
          
            <span className="font-normal text-lg ml-4 border-l pl-4 border-blue-400">
              Xin chào, <span className="text-yellow-300 font-bold">{displayName}</span>
            </span>
   

          {/* Thêm một nút đăng xuất nhanh trên Header (tùy chọn) */}
          {/* <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors text-sm shadow-md"
          >
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </button> */}
        </header>
        
        <main className="flex-1 p-8 bg-[#f6f8fa] overflow-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;