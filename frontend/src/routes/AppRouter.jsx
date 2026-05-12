import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomerPage from "../pages/CustomerPage";
import CustomerCreatePage from "../pages/CustomerCreatePage";
import CustomerEditPage from "../pages/CustomerEditPage";
import CustomerDetailPage from "../pages/CustomerDetailPage";
import RoomPage from "../pages/RoomPage";
import StayPage from "../pages/StayPage";
import DepositPage from "../pages/DepositPage";
import EmployeeManagementPage from "../pages/EmployeeManagementPage";
import Layout from "../components/layout/Layout";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute"; 

// 1. Gộp logic: Component này xử lý cả việc chặn quay lại Login VÀ điều hướng khi gõ URL linh tinh
const GuestRoute = ({ children }) => {
  // ĐỒNG BỘ: Sử dụng sessionStorage
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Nếu ĐÃ ĐĂNG NHẬP, tự động đá về đúng "địa bàn"
  if (user) {
    if (user.VaiTro === 'sales') return <Navigate to="/sales/customer-management" replace />;
    if (user.VaiTro === 'accountant') return <Navigate to="/accountant/stay-management" replace />;
    if (user.VaiTro === 'manager') return <Navigate to="/manager/employee-management" replace />;
    
    // Phòng hờ trường hợp role rác
    sessionStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Nếu CHƯA ĐĂNG NHẬP, cho phép render component bên trong (Form Login hoặc lệnh chuyển hướng)
  return children;
};

export default function AppRouter() {
  return (
    <Routes>
      {/* 2. KHẮC PHỤC: Bọc GuestRoute để bảo vệ form Login */}
      <Route path="/" element={<GuestRoute><Login /></GuestRoute>} />

      {/* ========================================== */}
      {/* KHU VỰC CỦA sales (KINH DOANH)              */}
      {/* ========================================== */}
      <Route element={<ProtectedRoute allowedRole="sales" />}>
        <Route path="sales" element={<Layout userRole="sales" />}>
          <Route path="customer-management" element={<CustomerPage />} />
          <Route path="customers/create" element={<CustomerCreatePage />} />
          <Route path="customers/:id/edit" element={<CustomerEditPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="room" element={<RoomPage />} />
        </Route>
      </Route>

      {/* ========================================== */}
      {/* KHU VỰC CỦA ACCOUNTANT (KẾ TOÁN)           */}
      {/* ========================================== */}
      <Route element={<ProtectedRoute allowedRole="accountant" />}>
        <Route path="accountant" element={<Layout userRole="accountant" />}>
          <Route path="stay-management" element={<StayPage />} />
          <Route path="deposit" element={<DepositPage />} />
        </Route>
      </Route>

      {/* ========================================== */}
      {/* KHU VỰC CỦA MANAGER (QUẢN LÝ)              */}
      {/* ========================================== */}
      <Route element={<ProtectedRoute allowedRole="manager" />}>
        <Route path="manager" element={<Layout userRole="manager" />}>
          <Route path="employee-management" element={<EmployeeManagementPage />} />
        </Route>
      </Route>

      {/* 3. TỐI ƯU: Xử lý gõ URL linh tinh (404) cực kỳ gọn gàng */}
      {/* Nếu gõ bậy: GuestRoute sẽ tự kiểm tra, có session thì trả về trang làm việc, không có session thì trả về "/" */}
      <Route path="*" element={<GuestRoute><Navigate to="/" replace /></GuestRoute>} />
    </Routes>
  );
}