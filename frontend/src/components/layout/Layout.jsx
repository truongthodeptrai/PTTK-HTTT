import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import SidebarAccountant from './SidebarAccountant';
import SidebarSales from './SidebarSales';


function Layout({ userRole }) {
  let SidebarComponent;
  if (userRole === 'KE_TOAN') SidebarComponent = SidebarAccountant;
  if (userRole === 'SALE') SidebarComponent = SidebarSales;
  // Thêm các role khác nếu cần
  return (
    <div className="flex min-h-screen bg-[#f6f8fa]">
      {/* Sidebar */}
      <SidebarComponent />
      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header nổi bật */}
        <header className="px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-300 text-white border-b-2 border-blue-800 font-semibold">
          <h2 className="m-0 text-2xl">
            Dashboard
            <span className="font-normal text-lg ml-4">
              Xin chào, <span className="text-yellow-300">{userRole}</span>
            </span>
          </h2>
        </header>
        {/* Main content area */}
        <main className="flex-1 p-8 bg-[#f6f8fa] overflow-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;