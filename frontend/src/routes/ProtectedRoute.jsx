import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRole }) {
  // 1. ĐỒNG BỘ: Sử dụng sessionStorage thay cho localStorage
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // 2. Nếu chưa đăng nhập -> Đá văng ra trang Login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. Nếu đã đăng nhập nhưng sai Vai trò -> Đá về đúng "địa bàn" của họ
  if (user.VaiTro !== allowedRole) {
    // Đã sửa 'sale' thành 'sales' cho khớp với DB
    if (user.VaiTro === 'sales') return <Navigate to="/sales/customer-management" replace />;
    if (user.VaiTro === 'accountant') return <Navigate to="/accountant/stay-management" replace />;
    if (user.VaiTro === 'manager') return <Navigate to="/manager/employee-management" replace />;
    
    // Nếu role rác, dọn dẹp và đá ra login
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  // 4. Nếu qua hết các vòng kiểm tra -> Cho đi tiếp
  return <Outlet />;
}