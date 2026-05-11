import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerPage from "../pages/CustomerPage";
import CustomerCreatePage from "../pages/CustomerCreatePage";
import CustomerEditPage from "../pages/CustomerEditPage";
import CustomerDetailPage from "../pages/CustomerDetailPage";
import RoomPage from "../pages/RoomPage";
import StayPage from "../pages/StayPage";
import DepositPage from "../pages/DepositPage";
import Layout from "../components/layout/Layout";

export default function AppRouter() {
  return (
    <Routes>
      {/* Khai báo Route cha chứa Layout */}
      <Route path="/" element={<Layout userRole="SALE" />}>
        
        {/* Các Route con sẽ tự động được render vào bên trong Layout */}
        <Route path="customer-management" element={<CustomerPage />} />
        <Route path="customers/create" element={<CustomerCreatePage />} />
        <Route path="customers/:id/edit" element={<CustomerEditPage />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        
        <Route path="room" element={<RoomPage />} />
        <Route path="stay-management" element={<StayPage />} />
        <Route path="deposit" element={<DepositPage />} />
        
        {/* ...other routes... */}
      </Route>
    </Routes>
  );
}